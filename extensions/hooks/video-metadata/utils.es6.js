export const getHeight = (streams) => {
  let value = null;
  if (streams && Array.isArray(streams)) {
    for (let element of streams) {
      if (element.height) {
        value = element.height;
        break;
      }
    }
  }
  return value;
};

export const getWidth = (streams) => {
  let value = null;
  if (streams && Array.isArray(streams)) {
    for (let element of streams) {
      if (element.width) {
        value = element.width;
        break;
      }
    }
  }
  return value;
};

export const getVideoDuration = (streams) => {
  let value = null;
  if (streams && Array.isArray(streams)) {
    for (let element of streams) {
      if (element.codec_type === "video" && element.duration) {
        value = element.duration;
        break;
      }
    }
  }
  return value;
};
