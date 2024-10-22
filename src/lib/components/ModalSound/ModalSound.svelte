<script lang="ts">
  import { twMerge } from 'tailwind-merge';

  import imgSound from '$lib/assets/sound.svg';
  import sound from '$lib/assets/bg_music_loop.mp3';

  $: modalOpen = true;

  function handleClick(isOn: boolean) {
    let song = new Audio(sound);
    song.volume=0.8;
    if(isOn) song.play();
    modalOpen = false;
  }
</script>

<!-- Background overlay -->
<div class={twMerge('hidden fixed inset-0 transition top-0 left-0 right-0 bottom-0 z-10 h-screen', modalOpen && 'block')}>
  <div class="absolute inset-0 bg-[#001335] opacity-75"></div>
</div>
<!-- Modal -->
<div class={twMerge('fixed z-10 inset-0 overflow-y-auto', !modalOpen && 'hidden opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95', modalOpen && 'block transition ease-out duration-300 transform opacity-100 translate-y-0 sm:scale-100')}>
  <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <!-- Modal panel -->
    <div class="w-full inline-block bg-[#DDEBFF] align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
      <div class="px-2 pb-4 sm:p-6 sm:pb-4">
        <!-- Modal content -->
        <img class="block mx-auto" src={ imgSound } alt="">
        <p class="mb-4 -mt-6 text-[#262626] text-sm font-bold text-center">
          Do you want to play with sound?
        </p>
        <div class="flex justify-center mb-2 gap-2">
          <button on:click={() => handleClick(true)} type="button" class="btn btn-on">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 25" fill="none"><path d="M18.825 8.49493L17.685 9.49993C18.3921 10.3384 18.7687 11.4064 18.7438 12.503C18.7189 13.5996 18.2944 14.6493 17.55 15.4549L18.6525 16.4749C19.6447 15.3997 20.2098 13.999 20.2415 12.5363C20.2733 11.0736 19.7695 9.64972 18.825 8.53243V8.49493Z" fill="currentColor"></path><path d="M15 22.9999C14.9008 22.9995 14.8026 22.9794 14.7112 22.9408C14.6198 22.9022 14.537 22.8458 14.4675 22.7749L8.7525 16.9999H3.75C3.55109 16.9999 3.36032 16.9209 3.21967 16.7803C3.07902 16.6396 3 16.4488 3 16.2499V8.74993C3 8.55102 3.07902 8.36025 3.21967 8.2196C3.36032 8.07895 3.55109 7.99993 3.75 7.99993H8.7525L14.4675 2.22493C14.608 2.08524 14.7981 2.00684 14.9963 2.00684C15.1944 2.00684 15.3845 2.08524 15.525 2.22493C15.6663 2.3634 15.7472 2.5521 15.75 2.74993V22.2499C15.75 22.4488 15.671 22.6396 15.5303 22.7803C15.3897 22.9209 15.1989 22.9999 15 22.9999ZM4.5 15.4999H9C9.21863 15.4985 9.42993 15.5787 9.5925 15.7249L14.25 20.4274V4.57243L9.5925 9.27493C9.42993 9.42112 9.21863 9.50136 9 9.49993H4.5V15.4999Z" fill="currentColor"></path></svg>
          </button>
          <button on:click={() => handleClick(false)} type="button" class="btn btn-off">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 25 25" fill="none"><path d="M23.75 9.87677L22.6925 8.81927L20 11.5118L17.3075 8.81927L16.25 9.87677L18.9425 12.5693L16.25 15.2618L17.3075 16.3193L20 13.6268L22.6925 16.3193L23.75 15.2618L21.0575 12.5693L23.75 9.87677Z" fill="currentColor"></path><path d="M14 23.0693C13.9008 23.0689 13.8026 23.0488 13.7112 23.0101C13.6198 22.9715 13.537 22.9151 13.4675 22.8443L7.7525 17.0693H2.75C2.55109 17.0693 2.36032 16.9902 2.21967 16.8496C2.07902 16.7089 2 16.5182 2 16.3193V8.81927C2 8.62035 2.07902 8.42959 2.21967 8.28894C2.36032 8.14828 2.55109 8.06927 2.75 8.06927H7.7525L13.4675 2.29427C13.608 2.15458 13.7981 2.07617 13.9963 2.07617C14.1944 2.07617 14.3845 2.15458 14.525 2.29427C14.6663 2.43274 14.7472 2.62144 14.75 2.81927V22.3193C14.75 22.5182 14.671 22.7089 14.5303 22.8496C14.3897 22.9902 14.1989 23.0693 14 23.0693ZM3.5 15.5693H8C8.21863 15.5678 8.42993 15.6481 8.5925 15.7943L13.25 20.4968V4.64177L8.5925 9.34427C8.42993 9.49046 8.21863 9.5707 8 9.56927H3.5V15.5693Z" fill="currentColor"></path></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .btn {
		@apply rounded-md border px-6 py-2.5 font-bold uppercase;
  }

	.btn-on {
		background: linear-gradient(180deg, #F8D918 0%, #FF9D02 100%);
	}

	.btn-off {
		background: linear-gradient(180deg, #d6d6d6 0%, #979797 100%);
	}
</style>
