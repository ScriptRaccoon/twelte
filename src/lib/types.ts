export type Post = {
	id: number;
	user_id: number;
	user_handle: string;
	content: string;
	created_at: string;
	likes_count: number;
	liked_by_user: number; // 0 or 1
};
