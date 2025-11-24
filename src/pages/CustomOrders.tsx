// src/pages/CustomOrders.tsx

import { useState, useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import shadowBoxSample from "@/assets/shadow-box-sample.png";
import glassDomeSample from "@/assets/glassdome-sample.png";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import Modal from "@/components/ui/modal";

const CustomOrders = () => {
  // Modal state for email confirmation
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [showcaseImageUrl, setShowcaseImageUrl] = useState<string | null>(null);
  const [girlCount, setGirlCount] = useState("1");
  const [boyCount, setBoyCount] = useState("0");
  const [dog, setDog] = useState("yes");
  const [embellishments, setEmbellishments] = useState("yes");
  const [presentation, setPresentation] = useState("shadowbox");
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [festive, setFestive] = useState("");
  const [others, setOthers] = useState("");
  const [formTouched, setFormTouched] = useState(false);
  // Customer details
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  // Photo upload state
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  // Password fields for user registration
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  // User authentication state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Extract showcase image from URL params
  useEffect(() => {
    console.log('Full location:', location);
    console.log('Location pathname:', location.pathname);
    console.log('Location search:', location.search);
    console.log('Location hash:', location.hash);
    console.log('Window location href:', window.location.href);

    // Try useSearchParams first
    let showcaseImage = searchParams.get('showcaseImage');

    // Fallback to manual parsing from location.search for HashRouter compatibility
    if (!showcaseImage && location.search) {
      const params = new URLSearchParams(location.search);
      showcaseImage = params.get('showcaseImage');
    }

    // Another fallback: parse from window.location.href directly
    if (!showcaseImage) {
      const urlParams = new URLSearchParams(window.location.search);
      showcaseImage = urlParams.get('showcaseImage');
      console.log('From window.location.search:', showcaseImage);
    }

    // Final fallback: parse from the full href
    if (!showcaseImage && window.location.href.includes('showcaseImage=')) {
      const match = window.location.href.match(/showcaseImage=([^&]+)/);
      if (match) {
        showcaseImage = match[1];
        console.log('From href regex match:', showcaseImage);
      }
    }

    console.log('Final showcase image from URL params:', showcaseImage);

    if (showcaseImage) {
      const decodedUrl = decodeURIComponent(showcaseImage);
      console.log('Decoded showcase image URL:', decodedUrl);
      setShowcaseImageUrl(decodedUrl);
    }
  }, [searchParams, location.search, location.pathname]);

  // Check if user is logged in and fetch their profile
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setCurrentUser(user);
          setIsLoggedIn(true);

          // Fetch user profile from user_profiles table
          const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile && !error) {
            // Auto-fill form with user data from user_profiles table
            setCustomerName(profile.full_name || '');
            setCustomerEmail(profile.email || user.email || '');
            setCustomerPhone(profile.phone || user.user_metadata?.phone || '');
            setCustomerAddress(profile.address || user.user_metadata?.address || '');
          } else {
            // Fallback to auth metadata
            setCustomerName(user.user_metadata?.full_name || '');
            setCustomerEmail(user.email || '');
            setCustomerPhone(user.user_metadata?.phone || '');
            setCustomerAddress(user.user_metadata?.address || '');
          }
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    checkUser();
  }, []);

  const themes = [
    "Birthday",
    "Anniversary",
    "Graduation",
    "Engagement/Love/Wedding",
    "Baby shower",
    "Grandparents",
    "Mother's Day",
    "Father's Day",
    "New Born",
    "Day-in-a-life-of",
  ];

  const getTotal = (girlCount: string, boyCount: string, dog: string, presentation: string) => {
    const numGirls = parseInt(girlCount, 10) || 0;
    const numBoys = parseInt(boyCount, 10) || 0;
    const numDog = dog === "yes" ? 1 : 0;
    const figurineTotal = (numGirls + numBoys + numDog) * 30;
    let presentationCost = 0;
    if (presentation === "shadowbox") presentationCost = 30;
    if (presentation === "glassdome") presentationCost = 40;
    if (presentation === "goldbase") presentationCost = 0;
    return figurineTotal + presentationCost;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let userId = currentUser?.id;

      // 1. Register user with Supabase Auth (only if not logged in)
      if (!isLoggedIn) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: customerEmail,
          password: password,
          options: {
            data: {
              full_name: customerName,
              phone: customerPhone,
              address: customerAddress,
            },
            emailRedirectTo: `${window.location.origin}/#/register-callback?type=custom-order`
          }
        });

        if (signUpError) {
          toast({
            title: 'Registration failed',
            description: signUpError.message,
            variant: 'destructive'
          });
          setIsSubmitting(false);
          return;
        }

        userId = signUpData.user?.id;
        if (!userId) {
          toast({
            title: 'Registration failed',
            description: 'No user ID returned.',
            variant: 'destructive'
          });
          setIsSubmitting(false);
          return;
        }
      } else {
        // Update user profile if name, phone, or address was filled in
        if (userId) {
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
              full_name: customerName,
              phone: customerPhone,
              address: customerAddress,
            })
            .eq('id', userId);

          if (updateError) {
            console.error('Profile update error:', updateError);
          }

          // Update user metadata as well
          const { error: metadataError } = await supabase.auth.updateUser({
            data: {
              full_name: customerName,
              phone: customerPhone,
              address: customerAddress,
            }
          });

          if (metadataError) {
            console.error('Metadata update error:', metadataError);
          }
        }
      }

      // Note: We don't sign in the user because email needs to be confirmed first
      // Profile will be created automatically via database trigger or webhook

      // 2. Upload images to FigureIt_Assets bucket (bucket is public, so no auth needed)
      const uploadedImageUrls: { name: string; url: string }[] = [];
      if (photoFiles.length > 0) {
        for (const file of photoFiles) {
          try {
            // Create unique filename to avoid conflicts
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `custom-orders/${userId}/${fileName}`;

            console.log('Uploading to bucket: FigureIt_Assets, path:', filePath);

            const { error: storageError } = await supabase.storage
              .from('FigureIt_Assets')
              .upload(filePath, file, { upsert: true });

            if (storageError) {
              console.error('Image upload error:', storageError);
              toast({
                title: 'Image upload failed',
                description: `Failed to upload ${file.name}: ${storageError.message}`,
                variant: 'destructive'
              });
              continue;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
              .from('FigureIt_Assets')
              .getPublicUrl(filePath);

            uploadedImageUrls.push({
              name: file.name,
              url: urlData.publicUrl
            });
          } catch (error) {
            console.error('Error processing image:', error);
          }
        }
      }

      // 3. Calculate estimated price
      const estimatedPrice = getTotal(girlCount, boyCount, dog, presentation);

      // 4. Save custom order (use anon key for public insert)
      const { data: orderData, error: orderError } = await supabase
        .from('custom_orders')
        .insert({
          estimated_price: estimatedPrice,
          status: 'pending',
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          girl_count: parseInt(girlCount, 10),
          boy_count: parseInt(boyCount, 10),
          dog,
          embellishments,
          presentation,
          theme: selectedTheme === "festive" ? festive : selectedTheme === "others" ? others : selectedTheme,
          festive: selectedTheme === "festive" ? festive : null,
          others: selectedTheme === "others" ? others : null,
          showCaseImage: showcaseImageUrl || null,
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order error:', orderError);
        toast({
          title: 'Order submission failed',
          description: orderError.message,
          variant: 'destructive'
        });

        // Sign out the user if order failed
        if (!isLoggedIn) {
          await supabase.auth.signOut();
        }
        setIsSubmitting(false);
        return;
      }

      // 6. Upload images to storage and insert into custom_order_images
      if (photoFiles.length > 0 && orderData?.id) {
        for (const file of photoFiles) {
          try {
            // Upload to Supabase Storage (bucket: 'FigureIt_Assets')
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${orderData.id}/${fileName}`;

            const { error: storageError } = await supabase.storage
              .from('FigureIt_Assets')
              .upload(filePath, file, { upsert: true });

            if (storageError) {
              console.error('Image upload error:', storageError);
              toast({
                title: 'Image upload warning',
                description: `Failed to upload ${file.name}`,
                variant: 'destructive'
              });
              continue;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
              .from('FigureIt_Assets')
              .getPublicUrl(filePath);

            // Insert image record
            const { error: imageError } = await supabase
              .from('custom_order_images')
              .insert({
                custom_order_id: orderData.id,
                image_name: file.name,
                image_url: urlData.publicUrl,
              });

            if (imageError) {
              console.error('Image record error:', imageError);
            }
          } catch (error) {
            console.error('Error processing image:', error);
          }
        }
      }

      // 7. Send custom order confirmation email
      try {
        console.log('Sending email with showcase image URL:', showcaseImageUrl);
        const orderImageHtml = showcaseImageUrl
          ? `<img src="${showcaseImageUrl}" alt="Custom Order Reference" style="max-width:300px; border-radius:8px;" />`
          : '';
        console.log('Email HTML for orderItem:', orderImageHtml);

        const emailUrl = import.meta.env.VITE_EMAIL_SERVICE_URL || '';
        await fetch(emailUrl + '/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: customerEmail,
            subject: 'Custom Order Confirmation - Figure It!',
            templateData: {
              orderItem: orderImageHtml,
              customerName: customerName,
            },
            templateName: 'CustomOrderEmail',
          }),
        });
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Don't fail the order if email fails
        toast({
          title: 'Order submitted successfully',
          description: 'However, the confirmation email could not be sent. We will contact you shortly.',
          variant: 'default'
        });
      }

      // 8. Sign out new users (they need to verify email first), but keep logged-in users signed in
      if (!isLoggedIn) {
        await supabase.auth.signOut();
      }

      // 9. Show success modal (only for new users)
      if (!isLoggedIn) {
        setShowEmailModal(true);
      } else {
        // For logged-in users, show a simple success toast
        toast({
          title: 'Order submitted successfully!',
          description: 'We will contact you shortly via WhatsApp to confirm your custom order.',
          variant: 'default'
        });
        // Optionally navigate back to shop
        navigate('/shop');
      }

      // 10. Reset form
      setGirlCount("1");
      setBoyCount("0");
      setDog("yes");
      setEmbellishments("yes");
      setPresentation("shadowbox");
      setSelectedTheme("");
      setFestive("");
      setOthers("");
      setPhotoFiles([]);
      setFormTouched(false);

      // Only reset personal info for new users (not logged-in users)
      if (!isLoggedIn) {
        setCustomerName("");
        setCustomerEmail("");
        setCustomerPhone("");
        setCustomerAddress("");
        setPassword("");
        setRePassword("");
      }

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Unexpected error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    // Basic required fields
    const basicFieldsValid = (
      customerName &&
      customerEmail &&
      customerPhone &&
      customerAddress &&
      girlCount &&
      boyCount !== undefined &&
      dog &&
      embellishments &&
      presentation &&
      (
        (selectedTheme && selectedTheme !== "festive" && selectedTheme !== "others") ||
        (selectedTheme === "festive" && festive) ||
        (selectedTheme === "others" && others)
      )
    );

    // If logged in, no password required
    if (isLoggedIn) {
      return basicFieldsValid;
    }

    // If not logged in, password validation required
    return (
      basicFieldsValid &&
      password &&
      rePassword &&
      password === rePassword &&
      password.length >= 6
    );
  };

  useEffect(() => {
    if (formTouched) {
      isFormValid();
    }
    // eslint-disable-next-line
  }, [girlCount, boyCount, dog, embellishments, presentation, selectedTheme, festive, others, customerName, customerEmail, customerPhone, customerAddress, password, rePassword]);

  // Calculate total figurines for presentation logic
  const numGirls = parseInt(girlCount, 10) || 0;
  const numBoys = parseInt(boyCount, 10) || 0;
  const numDog = dog === "yes" ? 1 : 0;
  const totalFigurines = numGirls + numBoys + numDog;
  const totalPeopleFigurines = numGirls + numBoys;
  const figurineLimitError = totalPeopleFigurines > 4;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Custom Order Form</h1>
            {isLoggedIn && (
              <p className="text-muted-foreground">Welcome back, {customerName}!</p>
            )}
          </div>

          {isLoadingUser ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 min-w-0 max-w-3xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      With reference to the photo you've uploaded, please specify number
                      of elements:
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Display showcase image if available */}
                    {showcaseImageUrl && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Reference Image:</h3>
                        <div className="flex justify-center">
                          <img
                            src={showcaseImageUrl}
                            alt="Showcase reference"
                            className="max-h-64 rounded-lg shadow-md object-contain"
                            onError={(e) => {
                              console.error('Image failed to load:', showcaseImageUrl);
                              console.log('Image error event:', e);
                            }}
                            onLoad={() => console.log('Image loaded successfully:', showcaseImageUrl)}
                          />
                        </div>
                      </div>
                    )}
                    {!showcaseImageUrl && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">No reference image provided. You can still submit your custom order.</p>
                      </div>
                    )}
                    <TooltipProvider>
                      <form onSubmit={e => {
                        e.preventDefault();
                        setFormTouched(true);
                        if (isFormValid()) handleSubmit(e);
                      }} className="space-y-8">

                        {/* Number of elements */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Number of girl figurine – 0, 1, 2, 3, 4</Label>
                            <Select
                              value={girlCount}
                              onValueChange={setGirlCount}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {["0", "1", "2", "3", "4"].map((v) => (
                                  <SelectItem key={v} value={v}>
                                    {v}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Number of boy figurine – 0, 1, 2, 3, 4</Label>
                            <Select
                              value={boyCount}
                              onValueChange={setBoyCount}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {["0", "1", "2", "3", "4"].map((v) => (
                                  <SelectItem key={v} value={v}>
                                    {v}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {/* Figurine count error message */}
                          {figurineLimitError && (
                            <div className="col-span-2">
                              <p className="text-red-600 text-sm mt-2">
                                Total number of figurines (girl + boy) cannot exceed 4. Please adjust your selection.
                              </p>
                            </div>
                          )}
                          <div className="space-y-2">
                            <Label>One dog figurine</Label>
                            <Select value={dog} onValueChange={setDog}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">yes</SelectItem>
                                <SelectItem value="no">no</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Embellishments as suitable (if required) – yes, no
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="ml-1 text-blue-500 hover:text-blue-700 cursor-pointer"><Info className="h-4 w-4" /></span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <span>Embellishments features - </span><br />
                                  <span>available one-of-a-kind small objects (flowers, hearts etc.)</span><br />
                                  <span>adding charm and vibrancy to your FIGUREIT</span><br />
                                  <span>with their whimsical colors and delicate textures </span>
                                </TooltipContent>
                              </Tooltip>
                            </Label>
                            <Select value={embellishments} onValueChange={setEmbellishments}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">yes</SelectItem>
                                <SelectItem value="no">no</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Final presentation */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-base bg-blue-600 text-white px-3 py-1 rounded">
                              Final presentation:
                            </span>
                          </div>
                          <div className="flex flex-col gap-2 ml-2">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="presentation"
                                value="shadowbox"
                                checked={presentation === "shadowbox"}
                                onChange={() => setPresentation("shadowbox")}
                              />
                              10"x 10" shadow box
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <span className="ml-1 text-blue-500 hover:text-blue-700 cursor-pointer">
                                    <Info className="h-4 w-4" />
                                  </span>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-64 p-2 flex flex-col items-center">
                                  <img
                                    src={shadowBoxSample}
                                    alt="Shadow Box Sample"
                                    className="rounded mb-2 max-h-40"
                                  />
                                  <span className="text-xs text-muted-foreground">
                                    Shadow box sample
                                  </span>
                                </HoverCardContent>
                              </HoverCard>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="presentation"
                                value="glassdome"
                                checked={presentation === "glassdome"}
                                onChange={() => setPresentation("glassdome")}
                                disabled={totalFigurines >= 4}
                              />
                              <span className={totalFigurines >= 4 ? "text-gray-400" : undefined}>
                                Glass dome with base
                              </span>
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <span className={"ml-1 " + (totalFigurines >= 4 ? "text-gray-400" : "text-blue-500 hover:text-blue-700") + " cursor-pointer"}>
                                    <Info className="h-4 w-4" />
                                  </span>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-64 p-2 flex flex-col items-center">
                                  <img
                                    src={glassDomeSample}
                                    alt="Glass Dome Sample"
                                    className="rounded mb-2 max-h-40"
                                  />
                                  <span className="text-xs text-muted-foreground">
                                    Glass dome sample
                                  </span>
                                </HoverCardContent>
                              </HoverCard>
                            </label>
                          </div>
                        </div>

                        {/* Theme/occasion */}
                        <div className="space-y-2">
                          <div className="font-semibold text-base bg-blue-600 text-white px-3 py-1 rounded mb-2">
                            Select theme/occasion:
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {themes.map((theme) => (
                              <label key={theme} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="theme"
                                  value={theme}
                                  checked={selectedTheme === theme}
                                  onChange={() => setSelectedTheme(theme)}
                                />
                                {theme}
                              </label>
                            ))}
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="theme"
                                value="festive"
                                checked={selectedTheme === "festive"}
                                onChange={() => setSelectedTheme("festive")}
                              />
                              Festive –
                              <Input
                                value={festive}
                                onChange={e => setFestive(e.target.value)}
                                className="w-24"
                                placeholder="Type..."
                                disabled={selectedTheme !== "festive"}
                              />
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="theme"
                                value="others"
                                checked={selectedTheme === "others"}
                                onChange={() => setSelectedTheme("others")}
                              />
                              Others –
                              <Input
                                value={others}
                                onChange={e => setOthers(e.target.value)}
                                className="w-24"
                                placeholder="Type..."
                                disabled={selectedTheme !== "others"}
                              />
                            </label>
                          </div>
                        </div>

                        {/* Photo Upload */}
                        <div className="mb-6">
                          <Label htmlFor="photoUpload" className="block mb-2 font-semibold">Upload up to 3 reference photos (optional):</Label>
                          <Input
                            id="photoUpload"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={e => {
                              const files = Array.from(e.target.files || []);
                              let newFiles = [...photoFiles, ...files];
                              // Remove duplicates by name
                              newFiles = newFiles.filter((file, idx, arr) => arr.findIndex(f => f.name === file.name) === idx);
                              if (newFiles.length > 3) {
                                alert("You can only upload up to 3 images.");
                                newFiles = newFiles.slice(0, 3);
                              }
                              setPhotoFiles(newFiles);
                              // Reset input so user can re-select the same file if needed
                              e.target.value = "";
                            }}
                          />
                          <div className="text-xs text-muted-foreground mt-1">Maximum 3 images allowed. Only image files are accepted.</div>
                          {photoFiles.length > 0 && (
                            <ul className="mt-2 text-sm text-muted-foreground">
                              {photoFiles.map((file, idx) => (
                                <li key={file.name + idx} className="flex items-center gap-2">
                                  <span>{file.name}</span>
                                  <button
                                    type="button"
                                    className="text-red-500 hover:underline text-xs"
                                    onClick={() => {
                                      setPhotoFiles(photoFiles.filter((_, i) => i !== idx));
                                    }}
                                  >
                                    Remove
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Customer Details */}
                        <div className="font-semibold text-base bg-blue-600 text-white px-3 py-1 rounded mb-2">
                          {isLoggedIn ? 'Your Information' : 'Create User Login'}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="customerName">Name *</Label>
                            <Input
                              id="customerName"
                              value={customerName}
                              onChange={e => setCustomerName(e.target.value)}
                              required
                              disabled={isLoggedIn && customerName !== ''}
                              className={isLoggedIn && customerName !== '' ? "bg-gray-100 cursor-not-allowed" : ""}
                              placeholder={isLoggedIn && !customerName ? "Please enter your name" : ""}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="customerAddress">Address *</Label>
                            <Input
                              id="customerAddress"
                              value={customerAddress}
                              onChange={e => setCustomerAddress(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="customerPhone">Phone *</Label>
                            <Input
                              id="customerPhone"
                              value={customerPhone}
                              onChange={e => setCustomerPhone(e.target.value)}
                              required
                              disabled={isLoggedIn && customerPhone !== ''}
                              className={isLoggedIn && customerPhone !== '' ? "bg-gray-100 cursor-not-allowed" : ""}
                              placeholder={isLoggedIn && !customerPhone ? "Please enter your phone number" : ""}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="customerEmail">Email</Label>
                            <Input
                              id="customerEmail"
                              type="email"
                              value={customerEmail}
                              onChange={e => setCustomerEmail(e.target.value)}
                              required
                              disabled={isLoggedIn}
                              className={isLoggedIn ? "bg-gray-100 cursor-not-allowed" : ""}
                            />
                          </div>
                        </div>

                        {/* Password fields - only show if not logged in */}
                        {!isLoggedIn && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="password">Password (minimum 6 characters)</Label>
                              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="rePassword">Re-enter Password</Label>
                              <Input id="rePassword" type="password" value={rePassword} onChange={e => setRePassword(e.target.value)} required minLength={6} />
                              {formTouched && password !== rePassword && rePassword && (
                                <p className="text-xs text-red-600">Passwords do not match</p>
                              )}
                            </div>
                          </div>
                        )}

                        <Button
                          type="submit"
                          className="w-full mt-4"
                          disabled={!isFormValid() || isSubmitting || figurineLimitError}
                        >
                          {isSubmitting ? "Submitting..." : "Submit Custom Order"}
                        </Button>
                      </form>
                    </TooltipProvider>
                  </CardContent>
                </Card>
              </div>

              {/* Cost Side Box */}
              <div className="w-full md:w-80 shrink-0">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-xl">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between"><span>Girl figurines</span><span>${parseInt(girlCount, 10) * 30}</span></div>
                      <div className="flex justify-between"><span>Boy figurines</span><span>${parseInt(boyCount, 10) * 30}</span></div>
                      <div className="flex justify-between"><span>Dog figurine</span><span>${dog === "yes" ? 30 : 0}</span></div>
                      <div className="flex justify-between"><span>Presentation</span><span>{presentation === "shadowbox" ? "$30" : presentation === "glassdome" ? "$40" : "$0"}</span></div>
                      <div className="flex justify-between"><span>Embellishments</span><span>Included</span></div>
                      <hr />
                      <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${getTotal(girlCount, boyCount, dog, presentation)}</span></div>
                    </div>
                    <div className="pt-6">
                      <TestimonialCarousel visibleCount={5} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Email Confirmation Modal */}
      <Modal open={showEmailModal} onOpenChange={setShowEmailModal}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Order Submitted Successfully! ✓</h2>
          <p className="mb-4">
            Thank you for your custom order. Your order has been received and saved.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
            <p className="font-semibold text-blue-900 mb-2">📧 Please Confirm Your Email</p>
            <p className="text-sm text-blue-800">
              We've sent a confirmation email to <strong>{customerEmail}</strong>.
              Please check your inbox and click the confirmation link to activate your account.
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
            <p className="font-semibold text-red-900 mb-1">⚠️ Important</p>
            <p className="text-sm text-red-800">
              You will not be able to log in to track your order until your email is confirmed.
            </p>
          </div>
          <Button onClick={() => {
            setShowEmailModal(false);
            window.location.href = '/';
          }} className="w-full">
            OK
          </Button>
        </div>
      </Modal>
    </div>
  );
};


export default CustomOrders;