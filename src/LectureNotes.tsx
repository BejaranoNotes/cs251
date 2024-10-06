import React, { useEffect, useRef, useState } from "react"
import { format, parse } from "date-fns"
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { useParams } from "react-router-dom"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable"
import { formatDate, getFullDate } from "./lib/utils"
import NavigationSidebar from "./NavigationSidebar"
import ThumbnailSidebar from "./ThumbnailSidebar"

const imageFiles = import.meta.glob("/public/notes/*/*/*/*.{jpg,jpeg,png,gif}")
const metadataFiles = import.meta.glob<{ topic: string }>(
  "/public/notes/*/*/*/metadata.json"
)

const LectureNotes: React.FC = () => {
  const { semester, date } = useParams<{ semester: string; date: string }>()
  const [images, setImages] = useState<string[]>([])
  const [topic, setTopic] = useState<string>("")

  /* Render Images and Fetch Topic */
  useEffect(() => {
    const loadImagesAndTopic = async () => {
      const imagePaths = Object.keys(imageFiles).filter((path) =>
        path.match(new RegExp(`notes/${semester}/[^/]+/${date}/`))
      )
      setImages(
        imagePaths.map(
          (path) => `${import.meta.env.BASE_URL}${path.replace("/public", "")}`
        )
      )

      const metadataPath = Object.keys(metadataFiles).find((path) =>
        path.match(new RegExp(`notes/${semester}/[^/]+/${date}/metadata.json`))
      )
      if (metadataPath) {
        const metadata = await metadataFiles[metadataPath]()
        setTopic(metadata.topic)
      } else {
        setTopic("No topic available")
      }
    }
    loadImagesAndTopic()
  }, [semester, date])

  /* Sidebar */
  const [showNavSidebar, setShowNavSidebar] = useState(window.innerWidth > 768)
  const [showThumbnailSidebar, setShowThumbnailSidebar] = useState(
    window.innerWidth > 768
  )
  const toggleNavSidebar = () => setShowNavSidebar(!showNavSidebar)
  const toggleThumbnailSidebar = () =>
    setShowThumbnailSidebar(!showThumbnailSidebar)

  /* Scroll & Zoom */
  const contentRef = useRef<HTMLDivElement>(null)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768
      setShowNavSidebar(!isMobile)
      setShowThumbnailSidebar(!isMobile)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    setCurrentPage(1)
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [date])

  const scrollToImage = (index: number) => {
    const container = contentRef.current
    const targetImage = document.getElementById(`image-${index}`)
    if (container && targetImage) {
      const containerRect = container.getBoundingClientRect()
      const imageRect = targetImage.getBoundingClientRect()
      const scrollOffset =
        imageRect.top - containerRect.top + container.scrollTop - 20 // 20px padding
      container.scrollTo({ top: scrollOffset, behavior: "smooth" })
      setCurrentPage(index + 1)
    }
  }

  const handleScroll = () => {
    const container = contentRef.current
    if (container) {
      const scrollTop = container.scrollTop
      const containerHeight = container.clientHeight
      const images = container.querySelectorAll("img")
      let currentVisibleImage = 1

      for (let i = 0; i < images.length; i++) {
        const img = images[i]
        const imgTop = img.offsetTop - container.offsetTop
        const imgBottom = imgTop + img.clientHeight

        if (
          imgTop <= scrollTop + containerHeight / 2 &&
          imgBottom >= scrollTop + containerHeight / 2
        ) {
          currentVisibleImage = i + 1
          break
        }
      }

      setCurrentPage(currentVisibleImage)
    }
  }

  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 10, 200))
  }

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 10, 50))
  }

  /* day of week */
  const fullDateStr = getFullDate(semester!, date!)
  const parsedDate = parse(fullDateStr, "yyyy-M-d", new Date())
  const dayOfWeek = format(parsedDate, "EEEE")

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen"
      key={`${showNavSidebar}-${showThumbnailSidebar}`}
    >
      {/* Navigation Sidebar */}
      {showNavSidebar && (
        <>
          <ResizablePanel
            defaultSize={15}
            minSize={10}
            style={{ overflow: "" }}
            className="h-screen overflow-y-auto bg-gray-300 p-4"
          >
            <NavigationSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
        </>
      )}
      {/* Main Content */}
      <ResizablePanel
        defaultSize={showNavSidebar && showThumbnailSidebar ? 70 : 85}
        minSize={50}
        className="flex h-screen flex-col bg-neutral-800"
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-neutral-700 p-4">
          <div className="flex items-center justify-center">
            <div className="flex flex-1 justify-start">
              <button
                onClick={toggleNavSidebar}
                className="rounded-md bg-neutral-600 p-1 text-white hover:bg-neutral-500"
              >
                {showNavSidebar ? (
                  <PanelLeftClose size={20} />
                ) : (
                  <PanelLeftOpen size={20} />
                )}
              </button>
            </div>
            <h1 className="text-xl font-semibold text-gray-300">{topic} </h1>
            <h2 className="ml-2 text-lg text-gray-300">
              ({dayOfWeek}, {formatDate(date!)})
            </h2>
            <div className="flex flex-1 items-center justify-end space-x-2">
              <button
                onClick={handleZoomOut}
                className="rounded-md bg-neutral-600 p-1 text-white hover:bg-neutral-500"
                disabled={zoomLevel <= 50}
              >
                <ZoomOut size={20} />
              </button>
              <span className="text-white">{zoomLevel}%</span>
              <button
                onClick={handleZoomIn}
                className="rounded-md bg-neutral-600 p-1 text-white hover:bg-neutral-500"
                disabled={zoomLevel >= 200}
              >
                <ZoomIn size={20} />
              </button>
              <button
                onClick={toggleThumbnailSidebar}
                className="rounded-md bg-neutral-600 p-1 text-white hover:bg-neutral-500"
              >
                {showThumbnailSidebar ? (
                  <PanelRightClose size={20} />
                ) : (
                  <PanelRightOpen size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Image Content */}
        <div
          ref={contentRef}
          className="flex-grow overflow-y-auto p-5"
          onScroll={handleScroll}
        >
          <div
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: "top left",
              transition: "transform 0.3s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {images.length > 0 ? (
              images.map((src, index) => (
                <div key={index} id={`image-${index}`} className="mb-5">
                  <img src={src} alt={`Note ${index + 1}`} className="w-full" />
                </div>
              ))
            ) : (
              <p className="text-white">No notes available for this date.</p>
            )}
          </div>
        </div>
      </ResizablePanel>
      {/* Thumbnail Sidebar */}
      {showThumbnailSidebar && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={15}
            minSize={10}
            style={{ overflow: "" }}
            className="h-screen overflow-y-auto bg-gray-300 p-7"
          >
            <ThumbnailSidebar
              images={images}
              onThumbnailClick={scrollToImage}
              currentPage={currentPage}
            />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  )
}

export default LectureNotes
