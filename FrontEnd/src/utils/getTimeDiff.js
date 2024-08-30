const getTimeDifference = (time, timeCommented) => {
  const difference = time - timeCommented;

  if (difference < 60) {
    return {
      value: Math.floor(difference < 1 ? difference + 3 : difference),
      unit: "seconds",
    };
  } else if (difference === 60) {
    return {
      value: 1,
      unit: "minute",
    };
  } else if (difference < 3600) {
    return {
      value: Math.floor(difference / 60),
      unit: "minutes",
    };
  } else if (difference === 3600) {
    return {
      value: 1,
      unit: "hour",
    };
  } else if (difference < 86400) {
    return {
      value: Math.floor(difference / 3600),
      unit: "hours",
    };
  } else if (difference < 172800) {
    return {
      value: 1,
      unit: "day",
    };
  } else if (difference < 604800) {
    return {
      value: Math.floor(difference / 86400),
      unit: "days",
    };
  } else if (difference < 1209600) {
    return {
      value: 1,
      unit: "week",
    };
  } else if (difference < 2419200) {
    return {
      value: Math.floor(difference / 604800),
      unit: "weeks",
    };
  } else if (difference < 29030400) {
    return {
      value: Math.floor(difference / 2419200),
      unit: "month",
    };
  }
};

export default getTimeDifference;
