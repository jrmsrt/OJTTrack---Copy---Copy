export async function loadApiState<T>(key: string): Promise<T | null> {
  const response = await fetch(`/api/${key}-state`);

  if (!response.ok) {
    throw new Error(`Unable to load ${key} state.`);
  }

  const payload = await response.json();
  return payload.state && Object.keys(payload.state).length > 0 ? payload.state : null;
}

export async function saveApiState<T>(key: string, state: T): Promise<void> {
  const response = await fetch(`/api/${key}-state`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ state }),
  });

  if (!response.ok) {
    throw new Error(`Unable to save ${key} state.`);
  }
}
