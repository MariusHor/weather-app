const FavoriteCard = favorite => `
        <div class="favorite-card relative top-0 left-0 transition ease-in-out duration-250 hover:-top-1 hover:-left-1 h-fit rounded-lg text-slate-800 text-xs overlay bg-slate-200 text-center">
            <button class="h-full w-full" data-btn="favorite-tag" data-tag="${favorite.tag}">
                <p class="m-3">${favorite.tag}</p>    
            </button>       
        </div>
    `;

export default FavoriteCard;
