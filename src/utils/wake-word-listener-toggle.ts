const turnWakeWordListenerOff = async (): Promise<any> => {
  return await fetch('http://pip.local:8000/stop', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });
};

const turnWakeWordListenerOn = async (): Promise<any> => {
  return await fetch('http://pip.local:8000/listen', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });
};

export { turnWakeWordListenerOff, turnWakeWordListenerOn };
