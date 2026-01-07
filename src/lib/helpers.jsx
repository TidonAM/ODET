import { format } from "date-fns";

export const formatCurrency = (amount) => {
	return new Intl.NumberFormat("en-PH", {
		style: "currency",
		currency: "PHP",
		minimumFractionDigits: 2,
	}).format(amount || 0);
};

export const formatDateForInput = (date = new Date()) => {
	return format(date, "yyyy-MM-dd");
};
