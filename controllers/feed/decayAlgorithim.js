function getPostAge(post) {
  const data = { ...post };
  const postDate = data.createdAt.split("T");
  const [postYear, postMonth, postDay] = postDate[0].split("-");
  const [postHour, postMinites, postSeconds] = postDate[1].split(":");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const currentHour = currentDate.getHours();
  const currentMinites = currentDate.getMinutes();
  let daysPassed = 0;
  let hourPosted = Number(postHour);
  let hourPassed = 0;
  let postedYear = Number(postYear);
  let postedMonth = Number(postMonth);
  let postedDay = Number(postDay);
  const thisYear = currentYear;
  const thisMonth = currentMonth;
  const thisDay = currentDay;
  const thisHour = currentHour === 0 ? 24 : currentHour;
  let pass = true;
  //
  for (let i = 0; pass === true; i++) {
    //break point
    if (
      postedYear === thisYear &&
      postedMonth === thisMonth &&
      postedDay == thisDay &&
      hourPosted === thisHour
    ) {
      pass = false;
      break;
    }
    //
    if (hourPosted === 24) {
      // if incremented post hour is equal 1 day
      hourPosted = 0; // reset hour (0:00)
      let monthLenth = 0; // validate which month we are
      if (
        postedMonth === 4 ||
        postedMonth === 6 ||
        postedMonth === 9 ||
        postedMonth === 11
      ) {
        //if we are in month with 30 days
        monthLenth = 30;
      } else if (postedMonth === 2) {
        // if we are in febuwary month lenth is 28 days or 29 if leep year
        // check if true is equal leep year
        if (
          postedYear % 4 === 0 &&
          (postedYear % 100 !== 0 || postedYear % 400 === 0)
        ) {
          monthLenth = 29;
        } else {
          monthLenth = 28;
        }
      } else {
        // other months are 31 days
        monthLenth = 31;
      }
      //
      if (postYear === thisYear) {
        // check if on the same year
        if (postedDay === monthLenth) {
          // if day lenth is equal to days in month
          postedDay = 1; // 1st day of next month
          postedMonth += 1; // next month
        } else {
          // else keep counting days
          postedDay += 1;
        }
      } else {
        if (postedDay === monthLenth && postedMonth === 12) {
          // if day lenth is equal to days in month and month lenth is equal 12 rest to next year
          postedDay = 1; // 1st day of next month
          postedMonth = 1; // next month
          postedYear += 1;
        } else if (postedDay === monthLenth) {
          // if day lenth is equal to days in month and month lenth is not equal 12
          postedDay = 1; // 1st day of next month
          postedMonth += 1; // next month
        } else {
          // else keep counting days
          postedDay += 1;
        }
      }
    } else {
      // if incremented post hour is not equal 1 day
      hourPosted += 1; // keep counting hours
    }
    //
    if (hourPassed === 24) {
      // if hour passed is equal 1 day
      hourPassed = 0; // reset hour (0:00)
      daysPassed += 1; // add days passed + 1
    } else {
      hourPassed += 1; // else keep counting hours
    }
  }
  return daysPassed;
}

function decayStats(post) {
  const daysPassed = getPostAge(post);
  const createdAtHalfLife = 7;
  const likesScore = post.engament.likes * 0.7;
  const viewsScore = post.engament.views * 0.3;
  const commentScore = post.engament.comments * 0.5;
  const agedScore = 100 * Math.pow(0.5, daysPassed / createdAtHalfLife);
  const engamentScore = likesScore + viewsScore + commentScore;
  const result = {
    ...post,
    totalScore: agedScore * engamentScore,
  };
  return result;
}

module.exports = decayStats;
