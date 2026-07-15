import { CHIP_UPDATE_REASON } from "../constants/games";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/chips`;

export const getChipsHistoryService = async (user_id, showTopup = true) => {
  try {

    const params = new URLSearchParams({
      showTopup: String(showTopup),
    });

    const response = await fetch(`${BASE_URL}/${user_id}?${params.toString()}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching chips data:", error);
    throw error;
  }
};

export const updateChipsAmtService = async ({
  user_id,
  amt,
  reason = CHIP_UPDATE_REASON.TOPUP,
}) => {
  const response = await fetch(`${BASE_URL}/${user_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: amt, reason: reason }),
  });

  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      data?.detail[0].msg || data?.message || "Top up failed";
    const error = new Error(errorMessage);
    error.status = response.status;
    error.payload = data;
    throw error;
  }
};
