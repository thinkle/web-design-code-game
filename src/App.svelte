<script>
  import Challenge from "./components/Challenge.svelte";
  import {challenges} from './lib/challenges';
</script>
<main>
<header>
  <h1>Cats in Boxes</h1>
</header>
<Challenge challenge={challenges[0]}/>
</main>

<style>
  main {
    height: 100vh;
    --header-height: 64px;
  }
  header {
    height: 64px;
    font-size: 18px;
    display: flex;
    justify-content: center;
  }
  h1 {
    margin: 0;
  }

</style>