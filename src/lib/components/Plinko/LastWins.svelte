<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import { winRecords } from '$lib/stores/game';

  import img100eur from '$lib/assets/100eur.png';
  import img200eur from '$lib/assets/200eur.png';

  /**
   * Number of last wins to display.
   */
  export let winCount = 1;
  $: animation = false;
  $: st = 0;
  $: lastWins = $winRecords.slice(-winCount).toReversed();

  $: if(lastWins.length !== 0){
    setTimeout(() => {
      animation = true;
    }, 1200);

    setTimeout(() => {
      lastWins = [];
      animation = false;
      st = st + 1;
    }, 2200);
  }
</script>

<div
  class="flex w-32 flex-col overflow-hidden lg:w-80"
  style:aspect-ratio={`1 / ${winCount}`}
>
  {#each lastWins as { binIndex, rowCount, payout: { multiplier } }, i (i)}
    <div
      class="flex aspect-square items-center justify-center font-bold text-gray-950"
    >
      <img class={twMerge('animate-jump animate-once animate-ease-in', animation && 'animate-jump-out')} src={ st === 0 ? img100eur : img200eur } alt="">
    </div>
  {/each}
</div>
