export function assetLoader(imageDir, imageName) {
  return new Promise(function (resolve, reject) {
    import(
      /* webpackMode: "lazy-once" */
      `../assets${imageDir}/${imageName}`
    )
      .then((src) => {
        resolve(src.default);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}
