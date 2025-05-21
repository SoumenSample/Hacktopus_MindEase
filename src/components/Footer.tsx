
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral-dark text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-xl font-semibold mb-4">MindEase</h3>
            <p className="text-gray-300 mb-4">
              Advanced stress monitoring technology to help you maintain mental wellbeing.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#technology" className="text-gray-300 hover:text-white transition-colors">Technology</a></li>
              <li><a href="#resources" className="text-gray-300 hover:text-white transition-colors">Resources</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#resources?tab=guides" className="text-gray-300 hover:text-white transition-colors">Breathing Guides</a></li>
              <li><a href="#resources?tab=blog" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#resources?tab=audio" className="text-gray-300 hover:text-white transition-colors">Relaxation Audio</a></li>
              <li><a href="#resources?tab=downloads" className="text-gray-300 hover:text-white transition-colors">Downloadables</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">soumensmaji1990@gmail.com</li>
                              <li className="text-gray-300">+91 9800166299</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} MindEase. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
