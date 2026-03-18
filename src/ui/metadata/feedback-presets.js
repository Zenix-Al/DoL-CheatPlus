export function toggleFeedback(label = 'Toggle') {
  return {
    title: label,
    enabled: 'Activated',
    disabled: 'Deactivated',
    variant: 'info',
  };
}

export function successFeedback(message, title) {
  return {
    success: message,
    variant: 'success',
    title,
  };
}

export function infoFeedback(message, title) {
  return {
    success: message,
    variant: 'info',
    title,
  };
}
