#!/usr/local/bin/fish

echo "Converting to HTML ..."

for file in *.md
    echo "Converting $file to HTML"
    pandoc "$file" -f markdown -t html -o (echo "../html/$file" | sed 's/\.md$/.html/') -s --data-dir=./
end

echo "HTML built successfully."
echo "Build complete !"