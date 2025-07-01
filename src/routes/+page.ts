import { error } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';

interface AgifyApiResponse {
  name: string;
  age: number;
  count: number;
}

export const load: ServerLoad = async ({ fetch, url }) => {
  const name = url.searchParams.get('name');

  if (!name) {
    return {
      name: '',
      streamed: {
        apiData: Promise.resolve(null)
      },
      errorMsg: 'Nome inválido'
    };
  }

  const fetchAge = async (): Promise<AgifyApiResponse | null> => {
    try {
      const res = await fetch(`https://api.agify.io?name=${name}`);
      if (!res.ok) {
        throw error(res.status, 'Não foi possível consultar a API');
      }
      const data: AgifyApiResponse = await res.json();
      
      if (data.age === null) return null;

      return data;
    } catch (e) {
      console.error("Erro ao buscar dados:", e);
      if (e && typeof e === 'object' && 'status' in e) throw e;
      throw error(500, 'Falha ao conectar com a API');
    }
  };

  return {
    name,
    streamed: {
      apiData: fetchAge()
    }
  };
};
