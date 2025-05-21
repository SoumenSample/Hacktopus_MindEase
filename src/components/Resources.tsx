
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, AudioLines, FileText, Download, Image } from "lucide-react";
import { ExternalLink } from "lucide-react";

type ResourceType = "all" | "guides" | "audio" | "blog" | "downloads" | "images";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  url: string;
  icon: JSX.Element;
  date?: string;
}

const resources: Resource[] = [
  {
    id: "1",
    title: "5-Minute Breathing Exercise",
    description: "A simple guide to calm your mind through controlled breathing",
    type: "guides",
    url: "https://www.mindful.org/a-five-minute-breathing-meditation/",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    id: "2",
    title: "Mindfulness at Work",
    description: "How to stay centered during high-pressure work situations",
    type: "blog",
    url: "https://hbr.org/2017/03/mindfulness-works-but-only-if-you-work-at-it",
    icon: <FileText className="h-5 w-5" />,
    date: "May 2, 2025"
  },
  {
    id: "3",
    title: "Calming Ocean Waves",
    description: "10-minute audio for relaxation and stress relief",
    type: "audio",
    url: "https://www.youtube.com/watch?v=V-_O7nl0Ii0",
    icon: <AudioLines className="h-5 w-5" />,
  },
  {
    id: "4",
    title: "MindEase Headband User Guide",
    description: "Comprehensive PDF guide to get the most from your device",
    type: "downloads",
    url: "https://www.pdfdrive.com/meditation-for-stress-management-e186826428.html",
    icon: <Download className="h-5 w-5" />,
  },
  {
    id: "5",
    title: "Progressive Muscle Relaxation",
    description: "Learn to release tension in each muscle group",
    type: "guides",
    url: "https://www.healthline.com/health/progressive-muscle-relaxation",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    id: "6",
    title: "Forest Serenity",
    description: "Calming image of a misty forest path",
    type: "images",
    url: "https://unsplash.com/photos/green-trees-during-daytime-1FxMET2U5dU",
    icon: <Image className="h-5 w-5" />,
  },
  {
    id: "7",
    title: "The Science of Stress",
    description: "Understanding how stress affects your body and mind",
    type: "blog",
    url: "https://www.health.harvard.edu/staying-healthy/understanding-the-stress-response",
    icon: <FileText className="h-5 w-5" />,
    date: "April 15, 2025"
  },
  {
    id: "8",
    title: "Guided Meditation Session",
    description: "20-minute audio journey to deep relaxation",
    type: "audio",
    url: "https://www.youtube.com/watch?v=O-6f5wQXSu8",
    icon: <AudioLines className="h-5 w-5" />,
  },
  {
    id: "9",
    title: "Quick Start Guide",
    description: "Get started with your MindEase headband in minutes",
    type: "downloads",
    url: "https://www.mindfulness.org/wp-content/uploads/2016/04/Beginning-a-mindfulness-practice.pdf",
    icon: <Download className="h-5 w-5" />,
  },
  {
    id: "10",
    title: "Ocean Sunset",
    description: "Beautiful calming ocean sunset view",
    type: "images",
    url: "https://unsplash.com/photos/silhouette-of-horizon-during-golden-hour-AiwcbsHHPRw",
    icon: <Image className="h-5 w-5" />,
  },
  {
    id: "11",
    title: "Stress Relief at Home",
    description: "Creating a sanctuary in your living space",
    type: "blog",
    url: "https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/stress-relief/art-20044456",
    icon: <FileText className="h-5 w-5" />,
    date: "March 28, 2025"
  },
  {
    id: "12",
    title: "Mountain Lake",
    description: "Peaceful mountain lake at dawn",
    type: "images",
    url: "https://unsplash.com/photos/body-of-water-surrounded-by-trees-70Rir5vB96U",
    icon: <Image className="h-5 w-5" />,
  },
];

const Resources = () => {
  const [selectedTab, setSelectedTab] = useState<ResourceType>("all");
  
  const filteredResources = selectedTab === "all" 
    ? resources 
    : resources.filter(resource => resource.type === selectedTab);
  
  return (
    <section id="resources" className="py-20 bg-slate-50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Resources</h2>
          <p className="text-muted-foreground">
            Explore our curated collection of resources to help manage stress and enhance wellbeing
          </p>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setSelectedTab(value as ResourceType)}>
          <div className="flex justify-center mb-10">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-1 bg-muted/80 p-1">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
              <TabsTrigger value="blog">Blog</TabsTrigger>
              <TabsTrigger value="downloads">Downloads</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="guides" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="audio" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="blog" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="downloads" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="images" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
  const { title, description, icon, type, date, url } = resource;
  
  // Define background color based on resource type
  const getBgColor = () => {
    switch (type) {
      case "guides": return "bg-blue-50 hover:bg-blue-100";
      case "audio": return "bg-purple-50 hover:bg-purple-100";
      case "blog": return "bg-neutral-50 hover:bg-neutral-100";
      case "downloads": return "bg-green-50 hover:bg-green-100";
      case "images": return "bg-amber-50 hover:bg-amber-100";
      default: return "bg-white hover:bg-gray-50";
    }
  };
  
  return (
    <Card className={`transition-all duration-300 hover:shadow-md ${getBgColor()} feature-card-hover border border-transparent hover:border-gray-200`}>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          {icon}
          <span className="capitalize">{type}</span>
          {date && <span className="ml-auto text-xs">{date}</span>}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => window.open(url, "_blank")}
        >
          View Resource <ExternalLink className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Resources;
