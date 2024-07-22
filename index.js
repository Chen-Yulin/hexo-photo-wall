hexo.extend.filter.register('before_generate', () => {
  console.log('This is my custom Hexo plugin!');
});
hexo.extend.filter.register('before_post_render', function(data) {
  const startTag = '--picture_wall--';
  const endTag = '--picture_wall_end--';

  const regex = new RegExp(`${startTag}[\\s\\S]*?${endTag}`, 'g');
  const postDate = data.date.format('YYYY/MM/DD');
  const postFileName = data.slug;


  data.content = data.content.replace(regex, match => {
    const pictures = match
      .replace(startTag, '')
      .replace(endTag, '')
      .trim();

    const pictureArray = pictures.split('\n').map(item => item.trim()).filter(item => item);

    pictureArray.forEach(picture => {
        const srcMatch = picture.match(/!\[.*?\]\((.*?)\s+\"(.*?)\"\)/);
        if (srcMatch && srcMatch[1]) {
        console.log(`Found image: ${srcMatch[1]}, title: ${srcMatch[2]}`);  // 输出匹配到的图片路径和标题
        }
    });

    let pictureWallHtml = '<div class="picture-wall">';

    pictureArray.forEach(picture => {
      const srcMatch = picture.match(/!\[.*?\]\((.*?)\s+\"(.*?)\"\)/);
      if (srcMatch && srcMatch[1]) {
        const imagePath = `/${postDate}/${postFileName}/${srcMatch[1]}`;
        pictureWallHtml += `<div class="picture-wall-item"><img src="${imagePath}" alt="${srcMatch[0]}""></div>`;
      }
    });

    pictureWallHtml += '</div>';

    console.log(pictureWallHtml);

    return pictureWallHtml;
  });

  return data;
});
