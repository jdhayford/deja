/* eslint-disable no-console */
let INSTANCE_ID = '';
chrome.instanceID.getID(instanceID => {
  INSTANCE_ID = instanceID;
  console.log(`Current Instance ID: ${INSTANCE_ID}`);
});

const getInstanceID = () => INSTANCE_ID;
export default getInstanceID;
