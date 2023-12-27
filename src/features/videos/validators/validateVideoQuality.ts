export const validateVideoQuality = (
  videoQuality: Array<string> | null | undefined,
) => {
  const allowableVideoResolutions = [
    "P144",
    "P240",
    "P360",
    "P480",
    "P720",
    "P1080",
    "P1440",
    "P2160",
  ];
  let res = true;
  let incorrectValue = null;
  if (videoQuality === null || videoQuality === undefined) return true;
  if (!Array.isArray(videoQuality) || videoQuality.length < 1) return false;

  for (let i = 0; i < videoQuality.length; i++) {
    let elem = videoQuality[i];
    let result = allowableVideoResolutions.some((el) => el === elem);
    if (result === false) {
      incorrectValue = videoQuality[i];
      res = result;
      break;
    }
  }
  return res;
};
