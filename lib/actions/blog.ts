"use server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { IBlog, Icourse, IModule } from "@/lib/types";
import { revalidatePath, unstable_noStore } from "next/cache";
import { BlogFormSchema, BlogFormSchemaType, Chapterformschematype , CourseFormSchematype } from "../../app/dashboard/blog/schema";
const DASHBOARD = "/dashboard/blog";
import slugify from "slugify";

export async function createBlog(data: {
	content: string;
	title: string;
	image: string;
	author:string;
	meta_title: string;
	meta_description: string;
	slug: string;
	status: boolean;
	created_at: string;
	coments_enabled: boolean;
	
}) {

	const supabase = await createSupabaseServerClient();
	const blogResult = await supabase
		.from("govtblog")
		.insert(data)
		.single();

    return blogResult;
}
export async function createNews(data: {
	title: string;
	image: string;
	author:string;
	news_link: string;
	status: string;
	created_at: string;
	
}) {

	const supabase = await createSupabaseServerClient();
	const NewsResult = await supabase
		.from("news_links")
		.insert(data)
		.single();

    return NewsResult;
}


export async function createLinks(data: {
	title: string;
	image: string;
	author:string;
	link: string;
	status: string;
	created_at: string;
	
}) {

	const supabase = await createSupabaseServerClient();
	const LinkssResult = await supabase
		.from("links")
		.insert(data)
		.single();

    return LinkssResult;
}

export async function createJob(data: {
	title: string;
	image: string;
	author:string;
	job_link: string;
	status: string;
	created_at: string;
	
}) {

	const supabase = await createSupabaseServerClient();
	const jobResult = await supabase
		.from("jobs_links")
		.insert(data)
		.single();

    return jobResult;
}

export type CreateExamData = {
  title: string;
  slug: string; // e.g., "jee-mains-2025"
  icon_url: string;
  category: string; // e.g., "Engineering"
  short_description: string;
  
  // Dates (passed as YYYY-MM-DD strings)
  exam_date?: string | null;
  application_start_date?: string | null;
  application_end_date?: string | null;
  
  // Links
  official_website_url?: string | null;
  syllabus_pdf_url?: string | null;
  roadmap_video_url?: string | null;

  // JSON Arrays (The rich data)
  youtube_channels?: any[]; 
  premium_courses?: any[];
  study_materials?: any[];
  
  is_active?: boolean;
};

export async function createExam(data: CreateExamData) {
  const supabase = await createSupabaseServerClient();

  const result = await supabase
    .from("exams")
    .insert({
      ...data,
      created_at: new Date().toISOString(), // Standard UTC timestamp
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (!result.error) {
    // Refresh the pages so the new exam appears immediately
    revalidatePath("/exams");
    revalidatePath("/"); 
  }

  return result;
}




// 1. Type Definition (Matches your Form Schema)
export type CreateStenoData = {
  title: string;
  transcript: string;
  audio_url: string;
  wpm: number;
  difficulty: string;
  category: string;
  is_premium: boolean;
};

// 2. Server Action to Create the Exercise
export async function createStenoExercise(data: CreateStenoData) {
  const supabase = await createSupabaseServerClient();
  const slug = slugify(data.title, { lower: true, strict: true }) + "-" + Date.now().toString().slice(-4);
  console.log(data, "data in server action");

  const result = await supabase
    .from("steno_exercises")
    .insert({
      ...data,
      slug: slug,
      created_at: new Date().toISOString(),
      // updated_at: new Date().toISOString(), // Uncomment if you have this column
    })
    .select()
    .single();

  if (!result.error) {
    // Refresh the listing pages immediately so the new dictation shows up
    revalidatePath("/stenography/dashboard");
    revalidatePath("/stenography"); 
  }
  console.log("Result from createStenoExercise action:", result);

  return result;
}







export async function adddidigitalproduct(data: {
	product_title: string,
	product_description: string,
	category: string,
	price: number,
	discount_price: number,
	product_type: string, // digital_download, service, consultation
	delivery_method: string, // instant_download, email, scheduled_call
	tags: string,
	preview_images: string,
	product_files: string, // For downloadable products
	consultation_duration: string, // For consultation services
	available_slots: string, // For services
	skill_level: string, // beginner, intermediate, advanced
	software_requirements: string,
	file_formats: string,
	license_type: string, // personal, commercial, extended
	refund_policy: string, // no_refunds, 7_days, 30_days
	status: string, // draft, active, inactive
	featured: boolean,
	user_id: string, // This would be populated from your auth system
	
}) {

	const supabase = await createSupabaseServerClient();
	const productResult = await supabase
		.from("digital_products")
		.insert(data)
		.single();

    return productResult;
}

export async function createlesson(data: {
	catagory_id: number
	chapter_name: string
	image:string
	content: string 
	course_id: string 
	created_at: string
	description: string 
	instructor: string
	module_id: string 
	chapterno:string 
	slug: string 
	pdffiles:string
}) {

	const supabase = await createSupabaseServerClient();
	const blogResult = await supabase
		.from("chapters")
		.insert(data)
		.single();

    return blogResult;
}

export async function savepdf(pdfFile: File) {
	const supabase = await createSupabaseServerClient();
	const filedata = await supabase.storage
		.from("pdffiles")
		.upload(`pdf/${pdfFile.name}`, pdfFile, {
			cacheControl: '3600',
			upsert: false 
		  
		  });

		  console.log(filedata);

    return filedata;
}


export async function listallimages() {
	const supabase = await createSupabaseServerClient();
	const { data, error } = await supabase.storage
    .from('images')
    .list('uploads', { limit: 100, offset: 0, sortBy: { column: 'name', order: 'asc' } });

  if (error) {
    console.error('Error fetching images:', error);
    return [];
  }

  return data;
}

export async function createModule(data: {
	created_at?: string;
	module_name: string;
	module_description: string;
	module_number: number;
	course_id: string;
	slug: string;
	
}) {

	const supabase = await createSupabaseServerClient();
	const blogResult = await supabase
		.from("modules")
		.insert(data)
		.single();
		console.log(blogResult)
	revalidatePath("/dashbaord/course/build");	
    return blogResult;
}

export async function createCourse(data: {
	banner_image: string;
	created_at: string;
	Catogory_id: string;
	Description: string;
	instructor: string; 
	Name: string;
	price: string;
	slug: string;
}) {
	const supabase = await createSupabaseServerClient();
	console.log("this is submitable data ", data);
	const CourseResult = await supabase
		.from("course")
		.insert(data)
		.single();
	console.log(CourseResult);	

    return CourseResult;
}


export async function readCatogries() {
	await new Promise((resolve) => setTimeout(resolve, 2000));
	const supabase = await createSupabaseServerClient();
	return supabase
		.from("catagory")
		.select("*")
		.order("created_at", { ascending: true });
}

export async function readmodulescourse(id: string) {
	await new Promise((resolve) => setTimeout(resolve, 2000));
	const supabase = await createSupabaseServerClient();
	return supabase
		.from("modules")
		.select("*")
		.eq("slug", id)
		.single();
}	



export async function readBlog() {
	const supabase = await createSupabaseServerClient();
	return supabase
		.from("govtblog")
		.select("*")
		.eq("status", true)
		.range(0, 7)
		.order("created_at", { ascending: true });
}
export async function readchapter() {
	const supabase = await createSupabaseServerClient();
	return supabase
		.from("chapters")
		.select("*")
		.range(0, 10)
		.order("created_at", { ascending: true });
}



export async function readmoreblog() {
	const supabase = await createSupabaseServerClient();
	return supabase
		.from("govtblog")
		.select("*")
		.eq("status", true)
		.range(0, 35)
		.order("created_at", { ascending: true });
}


export async function readcourse() {
	const supabase = await createSupabaseServerClient();
	return supabase
		.from("course")
		.select("*")
		.order("created_at", { ascending: true });
}

export async function readBlogAdmin() {
	await new Promise((resolve) => setTimeout(resolve, 2000));

	const supabase = await createSupabaseServerClient();
	const { data: { user } } = await supabase.auth.getUser()
	const id = user?.id



	return supabase
		.from("govtblog")
		.select("*")
		.eq('author', id || " " )
		.order("created_at", { ascending: true });
		
}


export async function readJobByAdmin() {
	await new Promise((resolve) => setTimeout(resolve, 2000));

	const supabase = await createSupabaseServerClient();
	const { data: { user } } = await supabase.auth.getUser()
	const id = user?.id
	return supabase
		.from("jobs_links")
		.select("*")
		.eq('author', id || " " )
		.order("created_at", { ascending: true });
		
}

export async function readlinksByAdmin() {
	await new Promise((resolve) => setTimeout(resolve, 2000));

	const supabase = await createSupabaseServerClient();
	const { data: { user } } = await supabase.auth.getUser()
	const id = user?.id
	return supabase
		.from("links")
		.select("*")
		.eq('author', id || " " )
		.order("created_at", { ascending: true });
		
}
export async function readnewsbyadmin() {
	await new Promise((resolve) => setTimeout(resolve, 2000));

	const supabase = await createSupabaseServerClient();
	const { data: { user } } = await supabase.auth.getUser()
	const id = user?.id
	return supabase
		.from("news_links")
		.select("*")
		.eq('author', id || " " )
		.order("created_at", { ascending: true });
		
}

export async function Coursebyadmin() {
	await new Promise((resolve) => setTimeout(resolve, 2000));

	const supabase = await createSupabaseServerClient();

	return supabase
		.from("course")
		.select("*")
		.eq('instructor', '8264f667-b643-4fdb-bfdc-8ce0982d3aff' )
		.order("created_at", { ascending: true });
		
}

export async function readBlogById(blogId: number) {
	const supabase = await createSupabaseServerClient();
	return supabase.from("govtblog").select("*").eq("id", blogId).single();
}
export async function readBlogIds() {
	const supabase = await createSupabaseServerClient();
	return supabase.from("govtblog").select("id");
}

export async function readBlogDeatailById(id : string) {
	const supabase = await createSupabaseServerClient();
	return await supabase
		.from("govtblog")
		.select("*")
		.eq("slug", id)
		.single();
}

export async function readcoursebyid(id : string) {
	const supabase = await createSupabaseServerClient();
	return await supabase
		.from("course")
		.select("*")
		.eq("slug", id)
		.single();
}
export async function readchapterdetailsbyid(id : string) {
	const supabase = await createSupabaseServerClient();
	return await supabase
		.from("chapters")
		.select("*")
		.eq("slug", id)
		.single();
}

export async function coursedetailsbyid(id : string) {
	const supabase = await createSupabaseServerClient();
	return await supabase
		.from("course")
		.select("*")
		.eq("slug", id)
		.single();
}



export async function getallimages() {
	const supabase = await createSupabaseServerClient();
	return await supabase.storage.from("images").list('images');
}

// export async function readBlogContent(blogId: string) {
// 	unstable_noStore();
// 	const supabase = await createSupabaseServerClient();
// 	return await supabase
// 		.from("blog_content")
// 		.select("content")
// 		.eq("blog_id", blogId)
// 		.single();
// }

export async function updateBlogById(blogId: string, data: IBlog) {
	const supabase = await createSupabaseServerClient();
	const result = await supabase.from("blog").update(data).eq("id", blogId);
	revalidatePath(DASHBOARD);
	revalidatePath("/blog/" + blogId);
	return JSON.stringify(result);
}

export async function updateBlogDetail(
	id: string,
	data: BlogFormSchemaType
) {
	const supabase = await createSupabaseServerClient();
	const resultBlog = await supabase
		.from("govtblog")
		.update(data)
		.eq("id", id);
	if (resultBlog) {
		return (resultBlog);
	} else {
		revalidatePath(DASHBOARD);
	}
}




export async function updatechapter(
	id: number,
	data: Chapterformschematype
) {
	const supabase = await createSupabaseServerClient();
	const resultchapter = await supabase
		.from("chapters")
		.update(data)
		.eq("id", id);
		console.log(data);

	
	if (resultchapter) {
		console.log(resultchapter);
		return (resultchapter);
	} else {
		revalidatePath(DASHBOARD);
	}
}

export async function updateCoursebyid(
	id: string,
	data: CourseFormSchematype
) {
	const supabase = await createSupabaseServerClient();
	const resultcourse = await supabase
		.from("course")
		.update(data)
		.eq("id", id);
	console.log(data);

	if (resultcourse) {
		console.log(resultcourse);
		return (resultcourse);
	} else {
		revalidatePath(DASHBOARD);
	}
}

export async function deleteBlogById(blogId: string) {
	console.log("deleting blog post")
	const supabase = await createSupabaseServerClient();
	const result = await supabase.from("blog").delete().eq("id", blogId);
	console.log(result);
	revalidatePath(DASHBOARD);
	revalidatePath("/blog/" + blogId);	
	return JSON.stringify(result);
}

export async function deleteJobById(Jobid: string) {
	console.log("deleting blog post")
	const supabase = await createSupabaseServerClient();
	const result = await supabase.from("jobs_links").delete().eq("id", Jobid);
	console.log(result);
	revalidatePath(DASHBOARD);
	revalidatePath("/blog/" + Jobid);	
	return JSON.stringify(result);
}


export async function deletelinkById(linkid: string) {
	console.log("deleting blog post")
	const supabase = await createSupabaseServerClient();
	const result = await supabase.from("links").delete().eq("id", linkid);
	console.log(result);
	revalidatePath(DASHBOARD);
	revalidatePath("/blog/" + linkid);	
	return JSON.stringify(result);
}




export async function deleteNewsbyid(newsid: string) {
	console.log("deleting blog post")
	const supabase = await createSupabaseServerClient();
	const result = await supabase.from("news_links").delete().eq("id", newsid);
	console.log(result);
	revalidatePath(DASHBOARD);
	revalidatePath("/blog/" + newsid);	
	return JSON.stringify(result);
}

export async function deleteCoursebyid(course_id: string) {
	const supabase = await createSupabaseServerClient();
	const result = await supabase.from("course").delete().eq("id", course_id);
	console.log(result);
	revalidatePath(DASHBOARD);
	revalidatePath("/course/" + course_id);	
	return JSON.stringify(result);
}
export async function deleteModulebyid(mdoule_id: number) {
	const supabase = await createSupabaseServerClient();
	const result = await supabase.from("modules").delete().eq("id", mdoule_id);
	console.log(result);
	revalidatePath(DASHBOARD);
	revalidatePath("/course/" + mdoule_id);	
	return JSON.stringify(result);
}
export async function deletechapterbyid(chapter_id: number) {
	const supabase = await createSupabaseServerClient();
	const result = await supabase.from("chapters").delete().eq("id", chapter_id);
	console.log(result);
	revalidatePath(DASHBOARD);
	revalidatePath("/course/" + chapter_id);
	return JSON.stringify(result);
}



export async function readmodulesbycourseId(courseId: string) {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	const supabase = await createSupabaseServerClient();
	return supabase.from("modules").select("*").eq("course_id", courseId).order("module_number", { ascending: true });

}

export async function readchaptersbymodule(module_id: string) {
	const supabase = await createSupabaseServerClient();
	return supabase
		.from("chapters")
		.select("module_id, chapter_name, slug, id, chapterno")
		.eq("module_id", module_id)
		.order("chapterno", { ascending: true });
}
export async function readchaptersbymodules(moduleIds: string[]) {
	const supabase = await createSupabaseServerClient();
	return supabase
		.from("chapters")
		.select("module_id, chapter_name, slug, id, chapterno")
		.in("module_id", moduleIds)
		.order("chapterno", { ascending: true });
}
export async function updatemodulebyid(id: number, data: IModule) {
	await new Promise((resolve) => setTimeout(resolve, 2000));
	const supabase = await createSupabaseServerClient();
	const result = await supabase.from("modules").update(data).eq("id", id);
	revalidatePath(DASHBOARD);
	return JSON.stringify(result);
}