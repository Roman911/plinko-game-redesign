<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import { winRecords, numberGame } from '$lib/stores/game';

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
    let song = new Audio('https://cdn.veliplay.com/rm/12.1.22/assets/plinko/audio/ball.mp3');
    song.volume = 0.8;
    song.play();

    st = st + 1;
  }

  $: if($numberGame === 2) {
    setTimeout(() => {
      animation = true;
      setTimeout(() => {
        lastWins = [];
        animation = false;
      }, 200);
    }, 2800);
  }
</script>

<div
  class="flex w-32 flex-col overflow-hidden lg:w-80"
  style:aspect-ratio={`1 / ${winCount}`}
>
  {#each lastWins as { payout: { multiplier } }}
    <div
      class="flex aspect-square items-center justify-center font-bold text-gray-950"
    >
      <img class={twMerge('animate-jump animate-once animate-ease-in', animation && 'animate-jump-out')} src={ st === 1 ? img100eur : img200eur } alt="">
    </div>
  {/each}
</div>
