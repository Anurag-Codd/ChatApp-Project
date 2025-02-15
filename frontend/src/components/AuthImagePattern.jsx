import{ useEffect, useRef, useState } from 'react';
import {imagesData} from '../constants/imageData';
import { gsap } from 'gsap';

const getNextImage = (currentImage, usedImages) => {
  let availableImages = imagesData.filter(
    (image) => !usedImages.includes(image) && image !== currentImage
  );
  if (availableImages.length === 0) {
    availableImages = imagesData.filter((image) => image !== currentImage);
  }
  const nextImage = availableImages[Math.floor(Math.random() * availableImages.length)];
  return nextImage;
};

const AuthImagePattern = ({ title, subtitle }) => {
  const [images, setImages] = useState([]);
  const flipRefs = useRef([]);
  const usedImagesRef = useRef([]);

  useEffect(() => {
    const initialImages = imagesData.slice(0, 9);
    setImages(initialImages);
    usedImagesRef.current = initialImages;
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    function getRandomSequence(length) {
      const arr = Array.from({ length }, (_, i) => i);
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    const flipSequence = getRandomSequence(9);

    const masterTimeline = gsap.timeline({ repeat: -1, delay: 1 });

    flipSequence.forEach((index, i) => {
      masterTimeline.add(flipTile(index), i * 1);
    });

    function flipTile(index) {
      const timeline = gsap.timeline();
      timeline
        .to(flipRefs.current[index], {
          rotationY: 90,
          duration: 1,
          ease: 'power1.inOut',
          onComplete: () => {
            const newImage = getNextImage(images[index], usedImagesRef.current);
            flipRefs.current[index].querySelector('img').src = newImage;
            usedImagesRef.current[index] = newImage;
          },
        })
        .to(
          flipRefs.current[index],
          {
            rotationY: 0,
            duration: 1,
            ease: 'power1.inOut',
          }
        );
      return timeline;
    }

    return () => {
      masterTimeline.kill();
    };
  }, [images]);

  const handleTileClick = (index) => {
    if (flipRefs.current[index].isAnimating) return;

    flipRefs.current[index].isAnimating = true;

    gsap
      .to(flipRefs.current[index], {
        rotationY: 90,
        duration: 0.8,
        ease: 'power1.inOut',
        onComplete: () => {
          const newImage = getNextImage(images[index], usedImagesRef.current);
          flipRefs.current[index].querySelector('img').src = newImage;
          usedImagesRef.current[index] = newImage;

          gsap.to(flipRefs.current[index], {
            rotationY: 0,
            duration: 0.8,
            ease: 'power1.inOut',
            onComplete: () => {
              flipRefs.current[index].isAnimating = false;
            },
          });
        },
      })
  };

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {images.map((imageSrc, i) => (
            <div
              key={i}
              ref={(el) => (flipRefs.current[i] = el)}
              className="aspect-square rounded-2xl overflow-hidden cursor-pointer"
              style={{ perspective: '1000px' }}
              onClick={() => handleTileClick(i)}
            >
              <img
                src={imageSrc}
                alt={`Tile ${i}`}
                className="w-full h-full object-cover"
                style={{ backfaceVisibility: 'hidden' }}
              />
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
