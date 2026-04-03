export const getToken =()=>sessionStorage.getItem("local-token");
const setToken=(token:string)=>sessionStorage.setItem("local-token", token);
const removeToken=()=>sessionStorage.removeItem("local-token");


const checkConnection = async (
  token: string,
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const response = await fetch("http://localhost:7700/establish-connection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    return response.json();
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: "Network request failed",
    };
  }
};

export async function EstablishLocalConnection(token: string) {
  const data = await checkConnection(token);
  if (data.success) {
    setToken(token);
  }
  return data;
}

export function DisconnectLocalConnection() {
  removeToken();
}


export function startConnectionWatch(
  onDisconnected: () => void,
  interval = 3000,
): () => void {
  const id = setInterval(async () => {
    const token = getToken();
    if (!token) return; // already disconnected, nothing to watch

    const data = await checkConnection(token);
    if (!data.success) {
        onDisconnected();
        DisconnectLocalConnection();
    };
  }, interval);

  return () => clearInterval(id); // ← call this to stop watching
}