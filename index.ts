import { $ } from "zx";
import { program } from "commander";

const download = async (url: string, dir: string): Promise<void> => {
  await $`aria2c -d ${dir} --seed-time=0 --max-overall-upload-limit=1K ${url}`;
};

const timeout = async (time: number): Promise<string[]> => {
  return new Promise((...[, reject]) => {
    setTimeout(reject, time, new Error(`timeout (${time / 1000}s)`));
  });
};

program
  .argument("<url>", "download url")
  .option("-d, --directory <path>", "download directory path", "downloads")
  .option("-t, --timeout <seconds>", "timeout", String(30 * 60));

program.parse(process.argv);

const { directory, timeout: timeoutSec } = program.opts<{
  directory: string;
  timeout: string;
}>();
const [url] = program.args;
new URL(url);

const main = () => {
  return Promise.race([
    download(url, directory),
    timeout(Number(timeoutSec) * 1000),
  ]);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
