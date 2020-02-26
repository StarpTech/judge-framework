export const getUrlParam = function getUrlParam(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if (results == null) return null;
  else return results[1];
};

export const mapToJson = map => {
  return JSON.stringify([...map]);
};

export const jsonToMap = jsonStr => {
  return new Map(JSON.parse(jsonStr));
};
