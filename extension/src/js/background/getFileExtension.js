const getFileExtension = url => {
  const ext = /^.+\.([^.]+)$/.exec(url);
  return ext == null ? "" : ext[1];
};

export default getFileExtension;
