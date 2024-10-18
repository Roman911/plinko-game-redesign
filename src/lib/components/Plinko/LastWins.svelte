<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import { binColorsByRowCount } from '$lib/constants/game';
  import { winRecords } from '$lib/stores/game';

  import img10eur from '$lib/assets/10eur.png';

  /**
   * Number of last wins to display.
   */
  export let winCount = 1;

  $: lastWins = $winRecords.slice(-winCount).toReversed();

  let st = 0;

</script>

<!-- Clamps in mobile:
      - Width: From 1.5rem at 340px viewport width to 2rem at 620px viewport width
      - Font size: From 8px at 340px viewport width to 10px at 620px viewport width
 -->
<div
  class="flex w-32 flex-col overflow-hidden lg:w-80"
  style:aspect-ratio={`1 / ${winCount}`}
>
  {#each lastWins as { binIndex, rowCount, payout: { multiplier } }}
    {setTimeout(() => {st=1}, 800)}
    <div
      class="flex aspect-square items-center justify-center font-bold text-gray-950"
    >
      <img class={twMerge('animate-jump animate-once animate-ease-in', st===1 && 'animate-jump-out')} src={ img10eur } alt="">
      <!--{multiplier}{multiplier < 100 ? '×' : ''}-->
    </div>
  {/each}
</div>
