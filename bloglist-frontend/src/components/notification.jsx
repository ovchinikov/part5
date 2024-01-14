const Notification = ({ message }) => {
  const style = {
    color: message.type === 'success' ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  if (!message.text) {
    return;
  } else {
    return <div style={style}>{message.text}</div>;
  }
};

export default Notification;
