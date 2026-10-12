export const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return digits.length === 11 && digits.startsWith('8') ? `7${digits.slice(1)}` : digits;
};

export const isValidPhone = (value: string) => /^\d{11,12}$/.test(normalizePhone(value));

export const formatPhone = (digits: string) => {
  const match = digits.match(/^7(\d{3})(\d{3})(\d{2})(\d{2})$/);
  return match ? `+7 ${match[1]} ${match[2]}-${match[3]}-${match[4]}` : `+${digits}`;
};

export const phoneToChatId = (phone: string) => `${phone}@c.us`;
