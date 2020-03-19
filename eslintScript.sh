npm init -yes
npm install eslint eslint-config-airbnb-base eslint-plugin-import -D
touch .eslintrc.js 
echo '{
  module.exports={"extends" : "airbnb-base"}
}' > .eslintrc.js
touch .gitignore 
echo '
/node_modules
*.log
.idea
.vscode
' > .gitignore
