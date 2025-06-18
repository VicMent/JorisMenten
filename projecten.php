<?php
// Fetch images from the specified directory
$directory = 'images/projecten/';
$images = glob($directory . "*.{jpg,jpeg,png,gif}", GLOB_BRACE);

$imagePaths = [];

// Collect image paths
foreach ($images as $image) {
    $imagePaths[] = $image;
}

// Output the HTML with the images
?>
<!DOCTYPE html>
<html lang="nl">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Onze Projecten</title>
    <link rel="stylesheet" href="css/style.css" />
    <style>
        /* Add some basic styles for the gallery */
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            text-align: center;
            margin: 0;
            padding: 20px;
        }

        h1 {
            color: #333;
            margin-bottom: 20px;
        }

        .gallery-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
        }

        .gallery-img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
    </style>
</head>

<body>
    <h1>Onze Projecten</h1>

    <div id="gallery" class="gallery-container">
        <?php foreach ($imagePaths as $imagePath): ?>
            <img src="<?php echo htmlspecialchars($imagePath); ?>" alt="Project Image" class="gallery-img" />
        <?php endforeach; ?>
    </div>
</body>

</html>