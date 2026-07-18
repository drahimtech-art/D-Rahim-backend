function getPostAge(post) {
  const daysPassed =
    (new Date() - new Date(post.createdAt)) / (1000 * 60 * 60 * 24);
  return daysPassed;
}

function decayStats(p, gc, fc, uc) {
  const post = { ...p };
  if (!post) return;
  const globalConnections = [...gc];
  const friendsConnections = [...fc];
  const userConnectionId = uc;
  const daysPassed = getPostAge(post);
  const createdAtHalfLife = 7;
  const likesScore = post.engament.likes * 0.3;
  const shares = post.engament.shares * 0.7;
  const commentScore = post.engament.comments * 0.5;
  const agedScore = 100 * Math.pow(0.5, daysPassed / createdAtHalfLife);
  const engamentScore = likesScore + shares + commentScore;
  console.log(shares);
  let friendsOrGlobalConnectionsScore = 0;
  // if post is from global person of creator user intaract with
  if (
    globalConnections.length !== 0 &&
    globalConnections.includes(post.connectionId)
  ) {
    friendsOrGlobalConnectionsScore = 1.5;
  } else if (
    friendsConnections.length !== 0 &&
    friendsConnections.includes(post.connectionId)
  ) {
    // else if post is from user friends connection
    friendsOrGlobalConnectionsScore = 3;
  }
  let totalScore = 0;
  if (friendsOrGlobalConnectionsScore !== 0) {
    //added it up with to totalscore if its from user intreast
    totalScore = (agedScore + engamentScore) * friendsOrGlobalConnectionsScore;
  } else {
    totalScore = agedScore + engamentScore;
  }
  if (userConnectionId) {
    if (post.engamentStates.likesId.includes(userConnectionId)) {
      totalScore *= 0.8;
    }
  }
  const result = {
    ...post,
    totalScore: Math.max(totalScore, 0.1),
  };

  return result;
}

module.exports = decayStats;
