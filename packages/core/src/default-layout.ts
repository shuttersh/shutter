export type HTMLString = string

const defaultLayout = (content: HTMLString, head: HTMLString = '') => `
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Shutter Visual Snapshot Test</title>
    ${head}
  </head>
  <body>
    ${content}
  </body>
</html>
`.trim()

export default defaultLayout
