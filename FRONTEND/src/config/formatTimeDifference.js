const formatTimeDifference = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const difference = now - date;

  const minutes = Math.floor(difference / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else {
    return `${days} days ago`;
  }
};

export default formatTimeDifference;
