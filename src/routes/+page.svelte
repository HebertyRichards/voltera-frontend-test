<script>
  import { goto } from '$app/navigation';

  /** @type {import('./$types').PageData} */
  export let data;

  let inputValue = data.name || '';
  let debounceTimer;

  const handleInput = () => {

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      const trimmedValue = inputValue.trim();

      if (trimmedValue) {
        goto(`/?name=${encodeURIComponent(trimmedValue)}`, { keepFocus: true, noScroll: true });
      } else {
        goto(`/`, { keepFocus: true, noScroll: true });
      }
    }, 1000);
  };

  $: inputValue = data.name || '';

</script>

<svelte:head>
  <title>Estimador de Idade</title>
  <meta name="description" content="Uma aplicação SvelteKit que estima a idade baseada em um nome." />
</svelte:head>

<main>
  <div class="card">
    <h1>Olá, Usúario!</h1>
    <p>Digite um nome abaixo e nós estimaremos a idade.</p>

    <div class="input-container">
      <input
        type="text"
        placeholder="Digite um nome..."
        bind:value={inputValue}
        on:input={handleInput}
        aria-label="Digite um nome"
      />
    </div>

    {#await data.streamed.apiData}
    <div class="result-placeholder">
      <div class="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  {:then apiResult}
      {#if apiResult && apiResult.age !== null}
        <div class="result fade-in">
          <p>A idade estimada para <strong>{apiResult.name}</strong> é de</p>
          <span class="age">{apiResult.age}</span>
          <p>anos.</p>
          <small>(Baseado em {apiResult.count.toLocaleString('pt-BR')} registros)</small>
        </div>
      {:else if data.name}
         <div class="result-placeholder">
            <p>Nenhum resultado encontrado para <strong>{data.name}</strong>.</p>
         </div>
      {/if}
    {:catch error}
        <div class="result error">
            <p>Ocorreu um erro: {error.message}</p>
        </div>
    {/await}

  </div>
</main>
<style>
  :root {
    --bg-dark-blue: #0d1117;
    --card-blue-gray: #161b22;
    --border-color: #30363d;
    --text-primary: #c9d1d9;
    --text-secondary: #8b949e;
    --accent-blue: #388bfd;
    --accent-blue-glow: rgba(56, 139, 253, 0.2);
  }

  main {
    display: flex;
    padding-top: 5em;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 40%;
  }

  .card {
    background-color: var(--card-blue-gray);
    padding: 2.5rem 3rem;
    border-radius: 16px;
    border: 1px solid var(--border-color);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    width: 100%;
    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  
  .card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.3), 0 0 20px var(--accent-blue-glow);
  }

  h1 {
    font-size: 2.5rem;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-secondary);
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .input-container {
    margin-bottom: 2rem;
  }

  input {
    width: 100%;
    padding: 1rem;
    font-size: 1.1rem;
    color: var(--text-primary);
    border: none;
    border-bottom: 2px solid var(--border-color);
    background-color: transparent;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    outline: none;
    text-align: center;
  }

  input:focus {
    border-color: var(--accent-blue);
    box-shadow: 0 4px 20px -5px var(--accent-blue-glow);
  }
  
  ::placeholder {
    color: var(--text-secondary);
    opacity: 0.6;
  }

  .result-placeholder {
      color: var(--text-secondary);
      min-height: 150px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
  }

  .result {
    margin-top: 1rem;
    padding: 1.5rem;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .result.error {
      background-color: rgba(211, 47, 47, 0.1);
      border: 1px solid rgba(211, 47, 47, 0.4);
      border-radius: 8px;
      color: #f7a8a8;
  }

  .result p {
    margin: 0;
    color: var(--text-secondary);
  }
  
  .result strong {
    color: var(--text-primary);
  }

  .result .age {
    font-size: 4rem;
    font-weight: 800;
    color: var(--accent-blue);
    margin: 0.5rem 0;
    line-height: 1;
    text-shadow: 0 0 15px var(--accent-blue-glow);
  }

  .result small {
    color: var(--text-secondary);
    opacity: 0.8;
    margin-top: 1rem;
  }
  
  .fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .loading-dots span {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--text-secondary);
    margin: 0 4px;
    animation: dot-pulse 1.4s infinite ease-in-out both;
  }

  .loading-dots span:nth-child(1) {
    animation-delay: -0.32s;
  }

  .loading-dots span:nth-child(2) {
    animation-delay: -0.16s;
  }

  @keyframes dot-pulse {
    0%, 80%, 100% {
      transform: scale(0.6);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @media (max-width: 1024px) {
    main {
      width: 60%;
    }
  }

  @media (max-width: 768px) {
    main {
      padding-top: 3em; 
      width: 90%;
    }
    .card {
    background-color: var(--card-blue-gray);
    padding: 2.5rem 3rem;
    border-radius: 16px;
    border: 1px solid var(--border-color);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    width: 100%;
    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
    .card {
      padding: 1rem 1.5rem; 
      width: 90%;
    }
    
    h1 {
      font-size: 1.5rem; 
    }

    p {
      font-size: 1rem; 
    }

    .result .age {
      font-size: 3.8rem; 
    }
  }

</style>