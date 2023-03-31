const FavoriteCard = favorite => `
        <div class="h-fit shadow-xl rounded-lg text-slate-100 text-xs overlay text-center">
            <button class="h-full w-full" data-btn="favorite-tag">
                <p class="text-slate-300 m-4">${favorite.tag}</p>    
            </button>       
        </div>
    `;

export default FavoriteCard;
