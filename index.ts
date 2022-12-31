import { $ } from "zx";
import { program } from "commander";

const download = async (url: string, dir: string): Promise<void> => {
  await $`aria2c -d ${dir} --seed-time=0 --max-overall-upload-limit=1K ${url}`;
};

program
  .argument("<url>", "download url")
  .option("-d, --directory <path>", "download directory path", "downloads");

program.parse(process.argv);

const { directory } = program.opts<{ directory: string }>();
const [url] = program.args;
new URL(url);

const main = () => {
  return download(url, directory);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
