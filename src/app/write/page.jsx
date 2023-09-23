"use client";

import Image from "next/image";
import styles from "./writePage.module.css";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/utils/firebase";
import ProgressBar from "@/components/Progressbar/ProgressBar";
import dynamic from "next/dynamic";

const WritePage = () => {
  const { status } = useSession();
  const ReactQuill =dynamic(()=>import('react-quill'),{ssr:false})
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [media, setMedia] = useState("");
  const [video, setVideo] = useState("");
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [progressbar, setProgressBar] = useState(0)

  useEffect(() => {
    const storage = getStorage(app);
    const upload = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, name);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setProgressBar(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setMedia(downloadURL);
          });
        }
      );
    };

    //video process
    const uploadVideo = () => {
      if (!videoFile) return; // Make sure a video file is selected

      const name = new Date().getTime() + videoFile.name;
      const storageRef = ref(storage, name);

      const uploadTask = uploadBytesResumable(storageRef, videoFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgressBar(progress);
          
          switch (snapshot.state) {
            case "paused":
              console.log("Video upload is paused");
              break;
            case "running":
              console.log("Video upload is running");
              break;
          }
        },
        (error) => {
          console.error("Error uploading video: ", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setVideo(downloadURL);
          });
        }
      );
    };

    file && upload();
    videoFile && uploadVideo();
  }, [file, videoFile]);

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/");
  }

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleSubmit = async () => {
    if (file !== null && videoFile !== null) {
      alert("please enter any one image or else video");
      setFile(null);
      setVideo(null);
      setProgressBar(0);
      router.push(`/`);
    } else {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          title,
          desc: value,
          img: media,
          videos: video,
          slug: slugify(title),
          catSlug: catSlug || "style", //If not selected, choose the general category
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        router.push(`/posts/${data.slug}`);
      }
    }
  };

  return (
    <div className={styles.container}>
      <p>File Upload {progressbar}%</p>
      <ProgressBar progress={progressbar} />
      <input
        type="text"
        placeholder="Title"
        className={styles.input}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        className={styles.select}
        onChange={(e) => setCatSlug(e.target.value)}
      >
        <option value="style">style</option>
        <option value="fashion">fashion</option>
        <option value="food">food</option>
        <option value="culture">culture</option>
        <option value="travel">travel</option>
        <option value="coding">coding</option>
      </select>
      <div className={styles.editor}>
        <button className={styles.button} onClick={() => setOpen(!open)}>
          <Image src="/plus.png" alt="" width={16} height={16} />
        </button>
        {open && (
          <div className={styles.add}>
            <input
              type="file"
              id="image"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
            />
            <input
              type="file" // Add a file input for video selection
              id="video"
              accept="video/*" // Specify that it should accept video files
              onChange={(e) => setVideoFile(e.target.files[0])} // Handle video file selection
              style={{ display: "none" }}
            />
            <button className={styles.addButton}>
              <label htmlFor="image">
                <Image src="/image.png" alt="" width={16} height={16} />
              </label>
            </button>
            <button className={styles.addButton}>
              <label htmlFor="video">
                {" "}
                {/* Use label to trigger file input */}
                <Image src="/video.png" alt="" width={16} height={16} />
              </label>
            </button>
          </div>
        )}
        <ReactQuill
          className={styles.textArea}
          theme="bubble"
          value={value}
          onChange={setValue}
          placeholder="Tell your story..."
        />
      </div>
      <button className={styles.publish} onClick={handleSubmit}>
        Publish
      </button>
    </div>
  );
};

export default WritePage;
