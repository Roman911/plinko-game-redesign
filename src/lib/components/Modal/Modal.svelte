<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import { winRecords } from '$lib/stores/game';

  const modalArt = new URL('$lib/assets/modal-art.png', import.meta.url).href;

  $: modalOpen = false;

  $: if($winRecords.length === 2) {
    setTimeout(() => {
      modalOpen = true;
    }, 2500);
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
      <div
        class="text-center p-2 font-bold"
        style:background="linear-gradient(180deg, #F8D918 0%, #FF9D02 100%)"
      >
        CONGRATULATIONS!
      </div>
      <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <!-- Modal content -->
        <img class="block mx-auto mb-4" src={ modalArt } alt="">
        <p class="text-[#262626] text-[13px] font-bold text-center">
          To continue playing game register on website
        </p>
      </div>
      <div class="px-4 pb-6 text-center">
        <!-- Subscribe button -->
        <button type="button" class="sign-up">
          sing up
        </button>
      </div>
    </div>
  </div>
</div>

<style>
	.sign-up {
		@apply rounded-md border px-6 py-2.5 font-bold uppercase;
		background: linear-gradient(180deg, #F8D918 0%, #FF9D02 100%);
	}
</style>
