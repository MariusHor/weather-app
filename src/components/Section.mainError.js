const MainError = message => `
      <div class="flex flex-col items-center justify-center">
        <h1 class="text-slate-300 text-2xl text-center mb-10">${message}</h1>
        <button class="rounded py-2 px-5 active:scale-95 hover:bg-amber-600 hover:text-slate-300 transition ease-in-out bg-slate-300 text-amber-600" data-btn="home-main">Home</button>
      </div>
    `;

export default MainError;
