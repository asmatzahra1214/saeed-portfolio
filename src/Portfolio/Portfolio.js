import { useEffect, useState, useRef } from "react";
import profile from './profile.jpg';
import {
  FaYoutube,
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaBars,
  FaTimes,
  FaUser,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaPlay,
  FaExpand,
  FaPause,
  FaWhatsapp,
} from "react-icons/fa";

const Portfolio = () => {
  const [videos, setVideos] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const iframeRef = useRef(null);

  // Social media links
  const socialLinks = {
    facebook: "https://web.facebook.com/saeedaslamofficials",
    instagram: "https://www.instagram.com/seedaslamofficial/",
    youtubeMain: "https://www.youtube.com/@SaeedAslamOfficial",
    youtubeSecond: "https://youtube.com/channel/UCEjkpCS2HBPyDntcjJIF2Gw?sub_confirmation=1",
    twitter: "https://twitter.com/saeedaslam123",
    whatsapp:"https://wa.me/+923401477595",
    email:"mailto:haideraslam922@gmail.com",
  };

  // Fetch videos from your database
  useEffect(() => {
    const fetchVideosFromDB = async () => {
      try {
        setLoadingVideos(true);
        const response = await fetch("http://localhost:8000/api/video");
        const data = await response.json();
        
        if (data.success) {
          setVideos(data.data || []);
        } else {
          console.error("Failed to fetch videos:", data.message);
        }
      } catch (err) {
        console.error("Error fetching videos from database:", err);
      } finally {
        setLoadingVideos(false);
      }
    };

    fetchVideosFromDB();
  }, []);

  // Load user data if authenticated
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Function to get embed URL based on video type
  const getEmbedUrl = (video, autoplay = false) => {
    if (video.type === 'youtube') {
      // Extract YouTube ID from various URL formats
      const youtubeId = video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&]+)/)?.[1];
      return youtubeId ? `https://www.youtube.com/embed/${youtubeId}?autoplay=${autoplay ? 1 : 0}&rel=0` : video.url;
    }
    if (video.type === 'vimeo') {
      const vimeoId = video.url.match(/vimeo\.com\/(\d+)/)?.[1];
      return vimeoId ? `https://player.vimeo.com/video/${vimeoId}?autoplay=${autoplay ? 1 : 0}` : video.url;
    }
    return video.url;
  };

  // Function to get thumbnail for YouTube videos
  const getThumbnail = (video) => {
    if (video.type === 'youtube') {
      const youtubeId = video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&]+)/)?.[1];
      return youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null;
    }
    return null;
  };

  // Open video modal and play video
  const openVideoModal = (video) => {
    setSelectedVideo(video);
    setIsPlaying(true);
  };

  // Close video modal
  const closeVideoModal = () => {
    setSelectedVideo(null);
    setIsFullscreen(false);
    setIsPlaying(false);
  };

  // Function to handle fullscreen
  const toggleFullscreen = () => {
    const element = videoRef.current;
    
    if (!document.fullscreenElement) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen(); // Safari
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen(); // IE/Edge
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (iframeRef.current) {
      // For iframes, we need to send a postMessage to control playback
      // This is a simplified approach - in a real app you'd need to handle
      // the specific API for each platform (YouTube, Vimeo, etc.)
      setIsPlaying(!isPlaying);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError(null);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        alert("Login successful!");
        window.location.href = "/";
      } else {
        setAuthError(result.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("An error occurred during login");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthError(null);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch("http://localhost:8000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
          role: 'user'
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Signup successful! Please login.");
        setShowSignup(false);
        setShowLogin(true);
      } else {
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join('\n');
          setAuthError(errorMessages);
        } else {
          setAuthError(result.message || "Signup failed");
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      setAuthError("An error occurred during signup");
    }
  };

  const handleAppointment = async (e) => {
    e.preventDefault();
    setAuthError(null);
    const formData = new FormData(e.target);
    const appointmentData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      collaboration_topic: formData.get('topic'),
      appointment_time: `${formData.get('date')} ${formData.get('time')}`.trim(),
      user_id: currentUser?.id || null
    };

    try {
      const response = await fetch("http://localhost:8000/api/appoinment", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(appointmentData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join('\n');
          setAuthError(errorMessages);
        } else {
          setAuthError(data.message || "Failed to book appointment");
        }
        return;
      }

      alert(data.message || "Appointment booked successfully!");
      e.target.reset();
    } catch (error) {
      console.error("Appointment error:", error);
      setAuthError("An error occurred while booking. Please try again.");
    }
  };

  const handleContact = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const contactData = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };

    try {
      const res = await fetch("http://localhost:8000/api/contact", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(contactData)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join('\n');
          alert(`Validation errors:\n${errorMessages}`);
        } else {
          alert(data.message || "Failed to send message");
        }
        return;
      }

      alert(data.message || "Message sent successfully!");
      e.target.reset();
    } catch (err) {
      console.error("Contact submission error:", err);
      alert("An error occurred while sending message. Please try again.");
    }
  };

  return (
    <div className="scroll-smooth font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
          <div className="text-2xl font-bold text-teal-600">Saeed Aslam</div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 font-semibold text-gray-700">
            <li><a href="#hero" className="hover:text-teal-600">Home</a></li>
            <li><a href="#about" className="hover:text-teal-600">About</a></li>
            <li><a href="#videos" className="hover:text-teal-600">Videos</a></li>
            <li><a href="#appointments" className="hover:text-teal-600">Appointments</a></li>
            <li><a href="#contact" className="hover:text-teal-600">Contact</a></li>
          </ul>

          {/* Social icons */}
          <div className="hidden md:flex space-x-4 text-teal-600 text-xl">
            <a href={socialLinks.youtubeMain} target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href={socialLinks.whatsapp} target="https://web.whatsapp.com/saeedaslamofficials" rel="noopener noreferrer"><FaWhatsapp /></a>
           
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex space-x-3 ml-6">
            <button
              onClick={() => setShowLogin(true)}
              className="px-4 py-2 border border-teal-600 text-teal-600 rounded hover:bg-teal-50"
            >
              Login
            </button>
            <button
              onClick={() => setShowSignup(true)}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              Signup
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-teal-600 text-2xl"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow-lg px-4 py-4 space-y-4">
            <a href="#hero" onClick={() => setMenuOpen(false)} className="block hover:text-teal-600">Home</a>
            <a href="#about" onClick={() => setMenuOpen(false)} className="block hover:text-teal-600">About</a>
            <a href="#videos" onClick={() => setMenuOpen(false)} className="block hover:text-teal-600">Videos</a>
            <a href="#appointments" onClick={() => setMenuOpen(false)} className="block hover:text-teal-600">Appointments</a>
            <a href="#contact" onClick={() => setMenuOpen(false)} className="block hover:text-teal-600">Contact</a>
            <div className="flex space-x-4 text-teal-600 text-xl pt-2">
              <a href={socialLinks.youtubeMain} target="https://www.youtube.com/@SaeedAslamOfficial" rel="noopener noreferrer"><FaYoutube /></a>
              <a href={socialLinks.instagram} target="https://www.instagram.com/seedaslamofficial/" rel="noopener noreferrer"><FaInstagram /></a>
              <a href={socialLinks.twitter} target="https://twitter.com/saeedaslam123" rel="noopener noreferrer"><FaTwitter /></a>
              <a href={socialLinks.facebook} target="https://web.facebook.com/saeedaslamofficials" rel="noopener noreferrer"><FaFacebook /></a>
              <a href={socialLinks.whatsapp} target="https://web.whatsapp.com/saeedaslamofficials" rel="noopener noreferrer"><FaWhatsapp /></a>
            </div>
            <div className="pt-4 space-y-2">
              <button
                onClick={() => {
                  setShowLogin(true);
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 border border-teal-600 text-teal-600 rounded"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowSignup(true);
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-teal-600 text-white rounded"
              >
                Signup
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="bg-gradient-to-r from-teal-500 via-sky-500 to-sky-700 text-white min-h-screen pt-32 pb-20 px-4"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          {/* Mobile: Image first */}
          <div className="lg:hidden flex justify-center w-full">
            <div className="relative group w-64 h-64 md:w-80 md:h-80">
              <img
                src={profile}
                alt="Saeed Aslam"
                className="w-full h-full rounded-full border-4 border-white shadow-2xl transform group-hover:scale-105 transition duration-500 object-cover"
              />
              <div className="absolute -inset-4 rounded-full border-4 border-white/30 animate-pulse"></div>
            </div>
          </div>

          {/* Text content */}
          <div className="text-center lg:text-left lg:w-1/2">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Saeed Aslam
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-lg mx-auto lg:mx-0">
              Inspiring people through <span className="font-semibold">storytelling</span>, 
              <span className="font-semibold"> travel</span>, and <span className="font-semibold">lifestyle vlogs</span>.
              Join over <b>500k subscribers</b> in exploring the world and living life with purpose.
            </p>

            <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-4">
              <a
                href={socialLinks.youtubeMain}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-teal-600 rounded-full hover:bg-gray-100 transition font-semibold"
              >
                Subscribe
              </a>
              <a
                href="#appointments"
                className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition font-semibold"
              >
                Book Appointment
              </a>
            </div>

            {/* Second Channel Link */}
            <div className="mt-6">
              <a 
                href={socialLinks.youtubeSecond}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline"
              >
                Check out my second channel
              </a>
            </div>
          </div>

          {/* Desktop: Image */}
          <div className="hidden lg:flex justify-end lg:w-1/2">
            <div className="relative group">
              <img
                src={profile}
                alt="Saeed Aslam"
                className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-white shadow-2xl transform group-hover:scale-105 transition duration-500 object-cover"
              />
              <div className="absolute -inset-4 rounded-full border-4 border-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-gradient-to-b from-white to-gray-50 text-center px-4">
        <h2 className="text-3xl font-bold mb-4 text-teal-600">About Me</h2>
        <p className="max-w-3xl mx-auto text-gray-700 leading-relaxed">
          I'm Saeed Aslam, a YouTuber with over <b>500k subscribers</b>. My passion lies in creating
          authentic travel stories, lifestyle content, and interviews that inspire others to
          explore, learn, and live with purpose. With 5+ years of experience and collaborations
          with global brands, I've built a community of dreamers and doers.
        </p>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <StatBlock number="500K+" label="Subscribers" />
          <StatBlock number="300+" label="Videos" />
          <StatBlock number="50+" label="Collaborations" />
          <StatBlock number="5+" label="Years Experience" />
        </div>
      </section>

      {/* Videos Section */}
      <section id="videos" className="py-20 bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-teal-600 text-center">Latest Videos</h2>
          
          {loadingVideos ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading videos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No videos available yet</h3>
              <p className="text-gray-500">Check back later for new content!</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105"
                >
                  {/* Video Thumbnail */}
                  <div className="relative aspect-video cursor-pointer" onClick={() => openVideoModal(video)}>
                    {getThumbnail(video) ? (
                      <img
                        src={getThumbnail(video)}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <FaPlay className="text-4xl text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                      <div className="bg-red-600 rounded-full p-4 opacity-90 hover:opacity-100 transition-opacity">
                        <FaPlay className="text-white text-xl" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Video Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-black mb-2 line-clamp-2">{video.title}</h3>
                    {video.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">
                        {video.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(video.created_at)}
                      </span>
                    </div>
                    <button
                      onClick={() => openVideoModal(video)}
                      className="mt-3 w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
                    >
                      Watch Video
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Appointments */}
<section
  id="appointments"
  className="py-20 bg-gradient-to-b from-white to-gray-50 text-center px-4"
>
  <h2 className="text-3xl font-bold mb-4 text-teal-600">Book an Appointment</h2>
  <p className="max-w-2xl mx-auto text-gray-700 mb-8">
    For collaborations, interviews, or events.
  </p>
  <form className="max-w-md mx-auto space-y-4" onSubmit={handleAppointment}>
    <InputField
      type="text"
      name="name"
      placeholder="Your Name"
      icon={<FaUser />}
    />
    <InputField
      type="email"
      name="email"
      placeholder="Your Email"
      icon={<FaEnvelope />}
    />
    <InputField type="text" name="topic" placeholder="Collaboration Topic" />
    <InputField
      type="text"
      name="phone"
      placeholder="Phone No"
      icon={<FaPhone />}
    />

    {/* Date input with placeholder fix */}
    <div className="relative">
      <input
        type="date"
        name="date"
        placeholder=" "
        className="peer w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <label className="absolute left-3 top-2 text-gray-400 text-sm peer-placeholder-shown:visible peer-valid:hidden peer-focus:hidden">
        Select Date
      </label>
    </div>

    {/* Time input with placeholder fix */}
    <div className="relative">
      <input
        type="time"
        name="time"
        placeholder=" "
        className="peer w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <label className="absolute left-3 top-2 text-gray-400 text-sm peer-placeholder-shown:visible peer-valid:hidden peer-focus:hidden">
        Select Time
      </label>
    </div>

    <input name="user_id" type="hidden" value={currentUser?.id || ""} />
    <button
      type="submit"
      className="px-6 py-3 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
    >
      Book Now
    </button>
  </form>
</section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-gradient-to-b from-gray-50 to-white text-center px-4">
        <h2 className="text-3xl font-bold mb-4 text-teal-600">Contact Me</h2>
        <p className="text-gray-700 mb-6">For business or personal inquiries.</p>
        <form
          className="max-w-md mx-auto space-y-4"
          onSubmit={handleContact}
        >
          <InputField type="text" name="name" placeholder="Your Name" icon={<FaUser />} />
          <InputField type="email" name="email" placeholder="Your Email" icon={<FaEnvelope />} />
          <textarea
            name="message"
            placeholder="Your Message"
            className="w-full p-3 border rounded"
            required
          ></textarea>
          <button type="submit" className="px-6 py-3 bg-teal-600 text-white rounded hover:bg-teal-700 transition">
            Send Message
          </button>
        </form>
      </section>

   {/* Footer */}
<footer className="bg-black text-white py-6 text-center px-4">
  <p>© 2025 Saeed Aslam. All rights reserved.</p>

  {/* Contact Info */}
  <div className="mt-3 space-y-1">
    <p className="text-sm">
      📧 <a href="mailto:haideraslam922@gmail.com" className="text-teal-400 hover:underline">
        haideraslam922@gmail.com
      </a>
    </p>
    <p className="text-sm">
      📞 <a href="tel:03401477595" className="text-teal-400 hover:underline">
        03401477595
      </a>
    </p>
  </div>

  {/* Social Links */}
  <div className="flex justify-center space-x-4 mt-4 text-xl text-teal-500">
    <a href={socialLinks.youtubeMain} target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
    <a href="https://web.whatsapp.com/saeedaslamofficials" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
  </div>
</footer>


      {/* Login Modal */}
      {showLogin && (
        <AuthModal title="Login" onClose={() => setShowLogin(false)}>
          <form onSubmit={handleLogin} className="space-y-4">
            <InputField type="email" name="email" placeholder="Email" icon={<FaEnvelope />} />
            <InputField type="password" name="password" placeholder="Password" icon={<FaLock />} />
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
            >
              Login
            </button>
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                className="text-teal-600 hover:underline"
                onClick={() => {
                  setShowLogin(false);
                  setShowSignup(true);
                  setAuthError(null);
                }}
              >
                Sign Up
              </button>
            </p>
          </form>
        </AuthModal>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <AuthModal title="Signup" onClose={() => setShowSignup(false)}>
          <form onSubmit={handleSignup} className="space-y-4">
            <InputField type="text" name="name" placeholder="Full Name" icon={<FaUser />} />
            <InputField type="email" name="email" placeholder="Email" icon={<FaEnvelope />} />
            <InputField type="password" name="password" placeholder="Password" icon={<FaLock />} />
            <InputField type="password" name="password_confirmation" placeholder="Confirm Password" icon={<FaLock />} />
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
            >
              Sign Up
            </button>
            <p className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                className="text-teal-600 hover:underline"
                onClick={() => {
                  setShowSignup(false);
                  setShowLogin(true);
                  setAuthError(null);
                }}
              >
                Login
              </button>
            </p>
          </form>
        </AuthModal>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg ${isFullscreen ? 'w-full h-full' : 'max-w-4xl w-full max-h-[90vh]'} overflow-hidden`}>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">{selectedVideo.title}</h3>
              <div className="flex space-x-3">
                <button
                  onClick={togglePlayPause}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                  title="Toggle fullscreen"
                >
                  <FaExpand />
                </button>
                <button
                  onClick={closeVideoModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            
            <div className="aspect-video bg-black relative" ref={videoRef}>
              <iframe
                src={getEmbedUrl(selectedVideo, isPlaying)}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                title={selectedVideo.title}
                ref={iframeRef}
              ></iframe>
              
              {/* Custom controls for mobile devices */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button
                  onClick={togglePlayPause}
                  className="bg-black bg-opacity-50 text-white p-2 rounded-md hover:bg-opacity-70 transition"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="bg-black bg-opacity-50 text-white p-2 rounded-md hover:bg-opacity-70 transition"
                  title="Toggle fullscreen"
                >
                  <FaExpand />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {selectedVideo.description && (
                <p className="text-gray-600 mb-4">{selectedVideo.description}</p>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                  {selectedVideo.type}
                </span>
                <span>Added: {formatDate(selectedVideo.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Components
const StatBlock = ({ number, label }) => (
  <div>
    <p className="text-3xl font-bold text-teal-600">{number}</p>
    <p className="text-gray-600">{label}</p>
  </div>
);

const InputField = ({ type, name, placeholder, icon }) => (
  <div className="flex items-center border rounded overflow-hidden">
    {icon && <div className="px-3 text-gray-500">{icon}</div>}
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className="w-full p-3 outline-none"
      required
    />
  </div>
);

const AuthModal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-sm relative">
      <button 
        onClick={onClose} 
        className="absolute top-2 right-3 text-gray-500 hover:text-black"
        aria-label="Close modal"
      >
        <FaTimes />
      </button>
      <h2 className="text-2xl font-bold mb-4 text-teal-600">{title}</h2>
      {children}
    </div>
  </div>
);

export default Portfolio;