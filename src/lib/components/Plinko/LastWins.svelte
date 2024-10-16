<script lang="ts">
  import { binColorsByRowCount } from '$lib/constants/game';
  import { winRecords } from '$lib/stores/game';

  /**
   * Number of last wins to display.
   */
  export let winCount = 1;

  $: lastWins = $winRecords.slice(-winCount).toReversed();
</script>

<!-- Clamps in mobile:
      - Width: From 1.5rem at 340px viewport width to 2rem at 620px viewport width
      - Font size: From 8px at 340px viewport width to 10px at 620px viewport width
 -->
<div
  class="flex w-32 flex-col overflow-hidden lg:w-32"
  style:aspect-ratio={`1 / ${winCount}`}
>
  {#each lastWins as { binIndex, rowCount, payout: { multiplier } }}
    <div
      class="flex aspect-square items-center justify-center font-bold text-gray-950"
    >
      <img src="/src/lib/assets/100eur.png" alt="">
      <!--{multiplier}{multiplier < 100 ? '×' : ''}-->
    </div>
  {/each}
</div>
