export const getSession = (state) => state.session;
export const getSessionStatus = (state) => state.sessionStatus;
export const getReplays = (state, code) => {
  const session = state.session;
  if (!session) return [];
  return state.replaysBySessionCode[session.code] || [];
}