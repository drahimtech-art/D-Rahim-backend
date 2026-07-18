function userMediaIntaractionsScoreingAlgorithim(
  data,
  isAuthorAConnectionToUser,
  authorId,
  hashTagsInPost,
  isEngamentOrDisEngament,
) {
  try {
    const userMediaIntrest = { ...data };
    const updatedUserMediaIntaractionConnections = []; // values to add to user leaing data for friends connections score
    const updateduserMediaIntaractionGlobalConnections = []; // values to add to user leaing data for global connections score
    const userHashTagesWithPostHashTags = []; // values to add to user leaing data for hashTages in post connections score
    const addedUserHashTagesWithPostHashTags = [];
    // score for connections
    if (isAuthorAConnectionToUser) {
      // conections score
      const userMediaIntaractionConnections =
        userMediaIntrest.mediaIntaractions.connectionsMedia;
      if (userMediaIntaractionConnections.length !== 0) {
        const connectionsIdAdded = [];
        for (let i = 0; i < userMediaIntaractionConnections.length; i++) {
          const connectionsData = {
            connectionId: userMediaIntaractionConnections[i].connectionId,
          };
          if (
            connectionsData.connectionId === authorId &&
            isEngamentOrDisEngament
          ) {
            const rate = userMediaIntaractionConnections[i].rate;
            const upDateConnectionsDataAndRate = {
              ...connectionsData,
              rate: rate >= 100 ? rate : rate + 0.5,
            };
            updatedUserMediaIntaractionConnections.push(
              upDateConnectionsDataAndRate,
            );
            connectionsIdAdded.push(connectionsData.connectionId);
          } else {
            const rate = userMediaIntaractionConnections[i].rate - 0.2;
            const upDateConnectionsDataAndRate = {
              ...connectionsData,
              rate: rate,
            };
            if (!(rate <= 0)) {
              updatedUserMediaIntaractionConnections.push(
                upDateConnectionsDataAndRate,
              );
              connectionsIdAdded.push(connectionsData.connectionId);
            }
            connectionsIdAdded.push(connectionsData.connectionId);
          }
          if (
            i + 1 === userMediaIntaractionConnections.length &&
            !connectionsIdAdded.includes(authorId)
          ) {
            const newConnectionData = {
              connectionId: authorId,
              rate: 0.5,
            };
            updatedUserMediaIntaractionConnections.push(newConnectionData);
            connectionsIdAdded.push(newConnectionData);
          }
        }
      } else {
        const newConnectionData = {
          connectionId: authorId,
          rate: 0.5,
        };
        updatedUserMediaIntaractionConnections.push(newConnectionData);
      }
      //for global coonections
      const userMediaIntaractionGlobalConnections =
        userMediaIntrest.mediaIntaractions.globalConnectionsMedia;
      for (const connections of userMediaIntaractionGlobalConnections) {
        const newGlobalConnectionData = {
          connectionId: connections.connectionId,
          rate: connections.rate - 0.2,
        };
        if (newGlobalConnectionData.rate > 0) {
          updateduserMediaIntaractionGlobalConnections.push(
            newGlobalConnectionData,
          );
        }
      }
    } else {
      const userMediaIntaractionGlobalConnections =
        userMediaIntrest.mediaIntaractions.globalConnectionsMedia;
      if (userMediaIntaractionGlobalConnections.length !== 0) {
        const globalConnectionsId = [];
        for (let i = 0; i < userMediaIntaractionGlobalConnections.length; i++) {
          const connectionsData = {
            connectionId: userMediaIntaractionGlobalConnections[i].connectionId,
          };
          if (
            connectionsData.connectionId === authorId &&
            isEngamentOrDisEngament
          ) {
            const rate = userMediaIntaractionGlobalConnections[i].rate;
            const upDateConnectionsDataAndRate = {
              ...connectionsData,
              rate: rate >= 100 ? rate : rate + 0.5,
            };
            updateduserMediaIntaractionGlobalConnections.push(
              upDateConnectionsDataAndRate,
            );
            globalConnectionsId.push(connectionsData.connectionId);
          } else {
            const rate = userMediaIntaractionGlobalConnections[i].rate - 0.2;
            const upDateConnectionsDataAndRate = {
              ...connectionsData,
              rate: rate,
            };
            if (!(rate <= 0)) {
              updateduserMediaIntaractionGlobalConnections.push(
                upDateConnectionsDataAndRate,
              );
              globalConnectionsId.push(connectionsData.connectionId);
            }
            globalConnectionsId.push(connectionsData.connectionId);
          }
          if (i + 1 === userMediaIntaractionGlobalConnections) {
            const newGlobalConnectionData = {
              connectionId: authorId,
              rate: 0.5,
            };
            updateduserMediaIntaractionGlobalConnections.push(
              newGlobalConnectionData,
            );
            globalConnectionsId.push(authorId);
          }
        }
      } else {
        const newGlobalConnectionData = {
          connectionId: authorId,
          rate: 0.5,
        };
        updateduserMediaIntaractionGlobalConnections.push(
          newGlobalConnectionData,
        );
      }
      //for friends coonections
      const userMediaIntaractionConnections =
        userMediaIntrest.mediaIntaractions.connectionsMedia;
      for (const connections of userMediaIntaractionConnections) {
        const newConnectionData = {
          connectionId: connections.connectionId,
          rate: connections.rate - 0.2,
        };
        if (newConnectionData.rate > 0) {
          updatedUserMediaIntaractionConnections.push(newConnectionData);
        }
      }
    }
    //score for hastags

    //
    if (hashTagsInPost.length !== 0) {
      const userHashTags = userMediaIntrest.mediaIntaractions.hashTags;
      if (userHashTags.length !== 0) {
        //
        for (let i = 0; i < hashTagsInPost.length; i++) {
          // added hastages in post
          const postHashTag = hashTagsInPost[i].trim();
          const hashTagsData = {
            tag: postHashTag,
          };
          for (let j = 0; j < userHashTags.length; j++) {
            if (
              userHashTags[j].tag.trim() === postHashTag &&
              !addedUserHashTagesWithPostHashTags.includes(postHashTag)
            ) {
              const rate = userHashTags[j].rate;
              let totalRate;
              if (isEngamentOrDisEngament) {
                totalRate = rate + 0.2;
              } else {
                totalRate = rate - 0.05;
              }
              if (totalRate > 0) {
                userHashTagesWithPostHashTags.push({
                  ...hashTagsData,
                  rate: totalRate,
                });
                addedUserHashTagesWithPostHashTags.push(postHashTag);
              } else {
                addedUserHashTagesWithPostHashTags.push(postHashTag);
              }
            }
            if (
              j + 1 === userHashTags.length &&
              !addedUserHashTagesWithPostHashTags.includes(postHashTag)
            ) {
              const rate = 0.2;
              userHashTagesWithPostHashTags.push({
                ...hashTagsData,
                rate: rate,
              });
              addedUserHashTagesWithPostHashTags.push(postHashTag);
            }
          }
        }
        ///
        for (let i = 0; i < userHashTags.length; i++) {
          if (
            !addedUserHashTagesWithPostHashTags.includes(
              userHashTags[i].tag.trim(),
            )
          ) {
            const hashTagsData = {
              tag: userHashTags[i].tag.trim(),
              rate: userHashTags[i].rate - 0.05,
            };
            if (hashTagsData.rate > 0) {
              userHashTagesWithPostHashTags.push(hashTagsData);
              addedUserHashTagesWithPostHashTags.push(hashTagsData.tag);
            }
          }
        }
      } else {
        for (let i = 0; i < hashTagsInPost.length; i++) {
          // added hastages in post
          const postHashTag = hashTagsInPost[i];
          const hashTagsData = {
            tag: postHashTag,
            rate: 0.2,
          };
          if (!addedUserHashTagesWithPostHashTags.includes(postHashTag)) {
            userHashTagesWithPostHashTags.push(hashTagsData);
            addedUserHashTagesWithPostHashTags.push(postHashTag);
          }
        }
      }
    } else {
      const userHashTags = userMediaIntrest.mediaIntaractions.hashTags;
      for (const tags of userHashTags) {
        userHashTagesWithPostHashTags.push(tags);
      }
    }
    //
    const mediaIntaractions = {
      hashTags: userHashTagesWithPostHashTags,
      connectionsMedia: updatedUserMediaIntaractionConnections,
      globalConnectionsMedia: updateduserMediaIntaractionGlobalConnections,
    };
    return mediaIntaractions;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { userMediaIntaractionsScoreingAlgorithim };
