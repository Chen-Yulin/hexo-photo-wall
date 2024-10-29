hexo.extend.filter.register('before_generate', () => {
  console.log('This is my custom Hexo plugin!');
});
hexo.extend.filter.register('before_post_render', function(data) {
  const startTag = '--picture_wall--';
  const endTag = '--picture_wall_end--';

  const regex = new RegExp(`${startTag}[\\s\\S]*?${endTag}`, 'g');
  const postDate = data.date.format('YYYY/MM/DD');
  const postFileName = data.slug;

  // Process picture wall
  data.content = data.content.replace(regex, match => {
    const pictures = match
      .replace(startTag, '')
      .replace(endTag, '')
      .trim();

    const pictureArray = pictures.split('\n').map(item => item.trim()).filter(item => item);

    let pictureWallHtml = '<div class="picture-wall">';

    pictureArray.forEach(picture => {
      const srcMatch = picture.match(/!\[.*?\]\((.*?)\s+\"(.*?)\"\)/);
      if (srcMatch && srcMatch[1]) {
        const imagePath = `/${postDate}/${postFileName}/${srcMatch[1]}`;
        pictureWallHtml += `<div class="picture-wall-item"><img src="${imagePath}" alt="${srcMatch[2]}" title="${srcMatch[2]}"></div>`;
      }
    });

    pictureWallHtml += '</div>';

    return pictureWallHtml;
  });

  // Process other images
  const imageRegex = /!\[([^\]]*)\]\(([^\s\)]+)(?:\s+"([^"]*)")?\)/g;
  data.content = data.content.replace(imageRegex, (match, alt, src, title) => {
    const imagePath = `/${postDate}/${postFileName}/${src}`;
    return `<div class="post-content"><img src="${imagePath}" alt="${alt || ''}" title="${title || alt || ''}"></div>`
  });

  return data;
});
