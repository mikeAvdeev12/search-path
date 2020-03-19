const fs = require('fs');
const args = require('args-parser')(process.argv);
const globby = require('globby');

const readGlob = (path) => (fs.existsSync(path)
  ? fs.readFileSync(path, { encoding: 'utf8' }).match(/.+/g)
  : []);

const findFilePath = async (path, sub_paths) => {
  const files = [];

  for (let i = 0; i < sub_paths.length; i++) {
    files.push(
      await globby(path + sub_paths[i]),
    );
  }

  const filesObj = files
    .flat()
    .reduce((ctx, filepath) => {
      ctx[filepath] = true;
      return ctx;
    }, {});

  return Object.keys(filesObj);
};

const getEditFiles = async ({ path }) => {
  const sub_paths_search = readGlob(path.search);
  const sub_paths_ignore = readGlob(path.ignore);

  const search = await findFilePath(path.dir, sub_paths_search);
  const ignore = await findFilePath(path.dir, sub_paths_ignore);

  return search.filter((path) => !ignore.includes(path));
};

const dir = args['path-dir'];
const search = args['path-search'];
const ignore = args['path-ignore'];

getEditFiles({
  path: {
    dir,
    search,
    ignore,
  },
}).then((paths_edit) => {
  for (let i = 0; i < paths_edit.length; i++) {
    const read_file = fs.readFileSync(paths_edit[i], { encoding: 'utf8' });

    if (read_file.match(/\/\* script was here \*[^\\]\n\n/) == null) {
      fs.writeFileSync(paths_edit[i], `/* script was here */\n\n${read_file}`);
    }
  }
});
