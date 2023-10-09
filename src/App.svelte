<script>
  import Challenge from "./components/Challenge.svelte";
  import {challenges} from './lib/challenges';
</script>
<h2>Challenge!</h2>
<Challenge challenge={challenges[0]}/>
