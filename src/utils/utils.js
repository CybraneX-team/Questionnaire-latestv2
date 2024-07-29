const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const formatTimeStamp = (timestamp) => {
  const year = timestamp.substring(0, 4);
  const month = timestamp.substring(4, 6);
  const day = timestamp.substring(6, 8);
  const hour = timestamp.substring(8, 10);
  const minute = timestamp.substring(10, 12);
  const second = timestamp.substring(12, 14);
  const millisecond = timestamp.substring(15, 18);

  const date = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    second,
    millisecond
  );

  let hours = date.getHours() % 12;
  hours = hours ? hours : 12;
  let minutes = date.getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let ampm = hours >= 12 ? "PM" : "AM";

  const formattedDate = `${date.getDate()} ${
    months[date.getMonth()]
  }, ${date.getFullYear()}  ${hours}:${minutes} ${ampm}`;

  return formattedDate;
};

export const mapQuestions = [
  "Issuer's cost breakdown by geography",
  "Issuer's revenue breakdown by geography",
  "What is the issuer's controlling jurisdiction?",
];
