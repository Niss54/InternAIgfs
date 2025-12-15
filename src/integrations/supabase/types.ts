export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Json | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      affiliate_partners: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          bank_account_details: Json | null
          business_registration_number: string | null
          can_post_internships: boolean | null
          commission_rate: number
          company_email: string
          company_logo_url: string | null
          company_name: string
          company_website: string | null
          contact_person_email: string
          contact_person_name: string
          contact_person_phone: string | null
          created_at: string
          current_month_posts: number | null
          id: string
          monthly_posting_limit: number | null
          rejection_reason: string | null
          status: string
          subscription_tier: string | null
          tax_id: string | null
          total_applicants: number | null
          total_hires: number | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          bank_account_details?: Json | null
          business_registration_number?: string | null
          can_post_internships?: boolean | null
          commission_rate?: number
          company_email: string
          company_logo_url?: string | null
          company_name: string
          company_website?: string | null
          contact_person_email: string
          contact_person_name: string
          contact_person_phone?: string | null
          created_at?: string
          current_month_posts?: number | null
          id?: string
          monthly_posting_limit?: number | null
          rejection_reason?: string | null
          status?: string
          subscription_tier?: string | null
          tax_id?: string | null
          total_applicants?: number | null
          total_hires?: number | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          bank_account_details?: Json | null
          business_registration_number?: string | null
          can_post_internships?: boolean | null
          commission_rate?: number
          company_email?: string
          company_logo_url?: string | null
          company_name?: string
          company_website?: string | null
          contact_person_email?: string
          contact_person_name?: string
          contact_person_phone?: string | null
          created_at?: string
          current_month_posts?: number | null
          id?: string
          monthly_posting_limit?: number | null
          rejection_reason?: string | null
          status?: string
          subscription_tier?: string | null
          tax_id?: string | null
          total_applicants?: number | null
          total_hires?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      affiliate_payouts: {
        Row: {
          created_at: string
          enrollment_id: string
          id: string
          partner_id: string
          payment_id: string
          payout_amount: number
          payout_date: string | null
          payout_status: string
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          enrollment_id: string
          id?: string
          partner_id: string
          payment_id: string
          payout_amount: number
          payout_date?: string | null
          payout_status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          enrollment_id?: string
          id?: string
          partner_id?: string
          payment_id?: string
          payout_amount?: number
          payout_date?: string | null
          payout_status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payouts_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "combo_pack_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_payouts_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "affiliate_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_payouts_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      alumni_stories: {
        Row: {
          advice_tags: string[] | null
          author_avatar: string | null
          author_current_company: string
          author_current_role: string
          author_location: string
          author_name: string
          comment_count: number | null
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          is_verified_alumni: boolean | null
          journey_timeline: Json | null
          like_count: number | null
          share_count: number | null
          skills_gained: string[] | null
          story_type: string
          title: string
          updated_at: string
          user_id: string
          view_count: number | null
        }
        Insert: {
          advice_tags?: string[] | null
          author_avatar?: string | null
          author_current_company: string
          author_current_role: string
          author_location: string
          author_name: string
          comment_count?: number | null
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_verified_alumni?: boolean | null
          journey_timeline?: Json | null
          like_count?: number | null
          share_count?: number | null
          skills_gained?: string[] | null
          story_type: string
          title: string
          updated_at?: string
          user_id: string
          view_count?: number | null
        }
        Update: {
          advice_tags?: string[] | null
          author_avatar?: string | null
          author_current_company?: string
          author_current_role?: string
          author_location?: string
          author_name?: string
          comment_count?: number | null
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_verified_alumni?: boolean | null
          journey_timeline?: Json | null
          like_count?: number | null
          share_count?: number | null
          skills_gained?: string[] | null
          story_type?: string
          title?: string
          updated_at?: string
          user_id?: string
          view_count?: number | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          applied_at: string
          id: string
          internship_id: string
          interview_date: string | null
          notes: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          applied_at?: string
          id?: string
          internship_id: string
          interview_date?: string | null
          notes?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          applied_at?: string
          id?: string
          internship_id?: string
          interview_date?: string | null
          notes?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_internship_id_fkey"
            columns: ["internship_id"]
            isOneToOne: false
            referencedRelation: "internships"
            referencedColumns: ["id"]
          },
        ]
      }
      auto_apply_credits: {
        Row: {
          created_at: string
          credits_remaining: number
          credits_used: number
          id: string
          last_auto_apply: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_remaining?: number
          credits_used?: number
          id?: string
          last_auto_apply?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_remaining?: number
          credits_used?: number
          id?: string
          last_auto_apply?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      auto_apply_history: {
        Row: {
          applied_at: string
          credits_used: number
          id: string
          internship_id: string
          match_score: number | null
          status: string | null
          user_id: string
        }
        Insert: {
          applied_at?: string
          credits_used?: number
          id?: string
          internship_id: string
          match_score?: number | null
          status?: string | null
          user_id: string
        }
        Update: {
          applied_at?: string
          credits_used?: number
          id?: string
          internship_id?: string
          match_score?: number | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auto_apply_history_internship_id_fkey"
            columns: ["internship_id"]
            isOneToOne: false
            referencedRelation: "internships"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_interactions: {
        Row: {
          content: string | null
          created_at: string
          id: string
          interaction_type: string
          post_id: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          interaction_type: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          interaction_type?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_interactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author: string | null
          category: string
          comment_count: number | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean | null
          is_premium: boolean | null
          like_count: number | null
          source_url: string | null
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author?: string | null
          category?: string
          comment_count?: number | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_premium?: boolean | null
          like_count?: number | null
          source_url?: string | null
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author?: string | null
          category?: string
          comment_count?: number | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_premium?: boolean | null
          like_count?: number | null
          source_url?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      channel_messages: {
        Row: {
          channel_id: string
          content: string
          created_at: string
          id: string
          is_deleted: boolean | null
          is_edited: boolean | null
          message_type: string
          metadata: Json | null
          reply_to_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          channel_id: string
          content: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          message_type?: string
          metadata?: Json | null
          reply_to_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          channel_id?: string
          content?: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          message_type?: string
          metadata?: Json | null
          reply_to_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "networking_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "channel_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_participants: {
        Row: {
          channel_id: string
          id: string
          is_muted: boolean | null
          joined_at: string
          last_read_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          channel_id: string
          id?: string
          is_muted?: boolean | null
          joined_at?: string
          last_read_at?: string | null
          role?: string
          user_id: string
        }
        Update: {
          channel_id?: string
          id?: string
          is_muted?: boolean | null
          joined_at?: string
          last_read_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_participants_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "networking_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          messages: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          messages?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          messages?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      combo_pack_enrollments: {
        Row: {
          combo_pack_id: string
          completed_at: string | null
          completion_certificate_issued: boolean | null
          course_progress: Json | null
          enrolled_at: string
          enrollment_status: string
          id: string
          internship_assigned: boolean | null
          internship_company_assigned: string | null
          internship_start_date: string | null
          notes: string | null
          partner_id: string
          payment_id: string | null
          user_id: string
        }
        Insert: {
          combo_pack_id: string
          completed_at?: string | null
          completion_certificate_issued?: boolean | null
          course_progress?: Json | null
          enrolled_at?: string
          enrollment_status?: string
          id?: string
          internship_assigned?: boolean | null
          internship_company_assigned?: string | null
          internship_start_date?: string | null
          notes?: string | null
          partner_id: string
          payment_id?: string | null
          user_id: string
        }
        Update: {
          combo_pack_id?: string
          completed_at?: string | null
          completion_certificate_issued?: boolean | null
          course_progress?: Json | null
          enrolled_at?: string
          enrollment_status?: string
          id?: string
          internship_assigned?: boolean | null
          internship_company_assigned?: string | null
          internship_start_date?: string | null
          notes?: string | null
          partner_id?: string
          payment_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "combo_pack_enrollments_combo_pack_id_fkey"
            columns: ["combo_pack_id"]
            isOneToOne: false
            referencedRelation: "combo_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "combo_pack_enrollments_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "affiliate_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "combo_pack_enrollments_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      combo_packs: {
        Row: {
          certificate_provided: boolean | null
          course_curriculum: string[] | null
          course_duration_weeks: number
          course_name: string
          created_at: string
          current_enrollments: number | null
          description: string
          difficulty_level: string | null
          discount_percentage: number | null
          end_date: string | null
          features: string[] | null
          id: string
          internship_company: string
          internship_duration_months: number
          internship_title: string
          is_active: boolean | null
          max_students: number | null
          mentorship_included: boolean | null
          original_course_price: number
          original_internship_price: number
          partner_id: string
          placement_assistance: boolean | null
          prerequisites: string[] | null
          start_date: string | null
          tags: string[] | null
          title: string
          total_price: number
          updated_at: string
        }
        Insert: {
          certificate_provided?: boolean | null
          course_curriculum?: string[] | null
          course_duration_weeks: number
          course_name: string
          created_at?: string
          current_enrollments?: number | null
          description: string
          difficulty_level?: string | null
          discount_percentage?: number | null
          end_date?: string | null
          features?: string[] | null
          id?: string
          internship_company: string
          internship_duration_months: number
          internship_title: string
          is_active?: boolean | null
          max_students?: number | null
          mentorship_included?: boolean | null
          original_course_price: number
          original_internship_price: number
          partner_id: string
          placement_assistance?: boolean | null
          prerequisites?: string[] | null
          start_date?: string | null
          tags?: string[] | null
          title: string
          total_price: number
          updated_at?: string
        }
        Update: {
          certificate_provided?: boolean | null
          course_curriculum?: string[] | null
          course_duration_weeks?: number
          course_name?: string
          created_at?: string
          current_enrollments?: number | null
          description?: string
          difficulty_level?: string | null
          discount_percentage?: number | null
          end_date?: string | null
          features?: string[] | null
          id?: string
          internship_company?: string
          internship_duration_months?: number
          internship_title?: string
          is_active?: boolean | null
          max_students?: number | null
          mentorship_included?: boolean | null
          original_course_price?: number
          original_internship_price?: number
          partner_id?: string
          placement_assistance?: boolean | null
          prerequisites?: string[] | null
          start_date?: string | null
          tags?: string[] | null
          title?: string
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "combo_packs_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "affiliate_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      company_invoices: {
        Row: {
          amount: number
          created_at: string
          due_date: string | null
          id: string
          invoice_number: string
          items: Json | null
          partner_id: string
          payment_date: string | null
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_number: string
          items?: Json | null
          partner_id: string
          payment_date?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          items?: Json | null
          partner_id?: string
          payment_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_invoices_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "affiliate_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_packages: {
        Row: {
          created_at: string
          credits: number
          discount_percentage: number | null
          id: string
          is_active: boolean | null
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          credits: number
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
        }
        Update: {
          created_at?: string
          credits?: number
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      daily_recommendations: {
        Row: {
          created_at: string
          id: string
          internship_id: string
          match_score: number
          reasons: string[]
          recommendation_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          internship_id: string
          match_score: number
          reasons?: string[]
          recommendation_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          internship_id?: string
          match_score?: number
          reasons?: string[]
          recommendation_date?: string
          user_id?: string
        }
        Relationships: []
      }
      freelance_gig_orders: {
        Row: {
          admin_notes: string | null
          client_rating: number | null
          client_review: string | null
          client_user_id: string
          created_at: string
          delivery_date: string | null
          dispute_reason: string | null
          escrow_amount: number
          final_delivery_url: string | null
          freelancer_rating: number | null
          freelancer_review: string | null
          freelancer_user_id: string
          gig_id: string
          id: string
          payment_id: string | null
          requirements_details: string
          revision_count_used: number | null
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          client_rating?: number | null
          client_review?: string | null
          client_user_id: string
          created_at?: string
          delivery_date?: string | null
          dispute_reason?: string | null
          escrow_amount: number
          final_delivery_url?: string | null
          freelancer_rating?: number | null
          freelancer_review?: string | null
          freelancer_user_id: string
          gig_id: string
          id?: string
          payment_id?: string | null
          requirements_details: string
          revision_count_used?: number | null
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          client_rating?: number | null
          client_review?: string | null
          client_user_id?: string
          created_at?: string
          delivery_date?: string | null
          dispute_reason?: string | null
          escrow_amount?: number
          final_delivery_url?: string | null
          freelancer_rating?: number | null
          freelancer_review?: string | null
          freelancer_user_id?: string
          gig_id?: string
          id?: string
          payment_id?: string | null
          requirements_details?: string
          revision_count_used?: number | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "freelance_gig_orders_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "freelance_gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freelance_gig_orders_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      freelance_gigs: {
        Row: {
          category: string
          created_at: string
          delivery_days: number
          description: string
          gig_extras: Json | null
          id: string
          is_active: boolean
          order_count: number | null
          portfolio_samples: string[] | null
          price: number
          rating: number | null
          requirements: string[] | null
          response_time_hours: number | null
          revision_count: number
          skills_required: string[] | null
          subcategory: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          view_count: number | null
        }
        Insert: {
          category: string
          created_at?: string
          delivery_days?: number
          description: string
          gig_extras?: Json | null
          id?: string
          is_active?: boolean
          order_count?: number | null
          portfolio_samples?: string[] | null
          price: number
          rating?: number | null
          requirements?: string[] | null
          response_time_hours?: number | null
          revision_count?: number
          skills_required?: string[] | null
          subcategory?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          view_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          delivery_days?: number
          description?: string
          gig_extras?: Json | null
          id?: string
          is_active?: boolean
          order_count?: number | null
          portfolio_samples?: string[] | null
          price?: number
          rating?: number | null
          requirements?: string[] | null
          response_time_hours?: number | null
          revision_count?: number
          skills_required?: string[] | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          view_count?: number | null
        }
        Relationships: []
      }
      guarantee_pack_enrollments: {
        Row: {
          admin_notes: string | null
          applications_count: number | null
          confirmed_offers_count: number | null
          created_at: string
          enrollment_date: string
          expiry_date: string | null
          fulfillment_date: string | null
          guarantee_fulfilled: boolean | null
          id: string
          pack_id: string
          payment_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          applications_count?: number | null
          confirmed_offers_count?: number | null
          created_at?: string
          enrollment_date?: string
          expiry_date?: string | null
          fulfillment_date?: string | null
          guarantee_fulfilled?: boolean | null
          id?: string
          pack_id: string
          payment_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          applications_count?: number | null
          confirmed_offers_count?: number | null
          created_at?: string
          enrollment_date?: string
          expiry_date?: string | null
          fulfillment_date?: string | null
          guarantee_fulfilled?: boolean | null
          id?: string
          pack_id?: string
          payment_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guarantee_pack_enrollments_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "premium_guarantee_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guarantee_pack_enrollments_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      internship_notifications: {
        Row: {
          created_at: string
          general_release_time: string
          general_sent: boolean | null
          id: string
          internship_id: string
          message: string
          notification_type: string
          premium_release_time: string
          premium_sent: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          general_release_time: string
          general_sent?: boolean | null
          id?: string
          internship_id: string
          message: string
          notification_type?: string
          premium_release_time: string
          premium_sent?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          general_release_time?: string
          general_sent?: boolean | null
          id?: string
          internship_id?: string
          message?: string
          notification_type?: string
          premium_release_time?: string
          premium_sent?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "internship_notifications_internship_id_fkey"
            columns: ["internship_id"]
            isOneToOne: false
            referencedRelation: "internships"
            referencedColumns: ["id"]
          },
        ]
      }
      internships: {
        Row: {
          application_count: number | null
          application_url: string | null
          company_logo_url: string | null
          company_name: string
          created_at: string
          deadline_date: string | null
          description: string | null
          duration_months: number | null
          id: string
          is_active: boolean | null
          is_premium_only: boolean | null
          location: string | null
          posted_by_partner_id: string | null
          posted_date: string | null
          remote_allowed: boolean | null
          requirements: string[] | null
          skills_required: string[] | null
          stipend_max: number | null
          stipend_min: number | null
          title: string
          updated_at: string
          view_count: number | null
          visibility_boost: number | null
        }
        Insert: {
          application_count?: number | null
          application_url?: string | null
          company_logo_url?: string | null
          company_name: string
          created_at?: string
          deadline_date?: string | null
          description?: string | null
          duration_months?: number | null
          id?: string
          is_active?: boolean | null
          is_premium_only?: boolean | null
          location?: string | null
          posted_by_partner_id?: string | null
          posted_date?: string | null
          remote_allowed?: boolean | null
          requirements?: string[] | null
          skills_required?: string[] | null
          stipend_max?: number | null
          stipend_min?: number | null
          title: string
          updated_at?: string
          view_count?: number | null
          visibility_boost?: number | null
        }
        Update: {
          application_count?: number | null
          application_url?: string | null
          company_logo_url?: string | null
          company_name?: string
          created_at?: string
          deadline_date?: string | null
          description?: string | null
          duration_months?: number | null
          id?: string
          is_active?: boolean | null
          is_premium_only?: boolean | null
          location?: string | null
          posted_by_partner_id?: string | null
          posted_date?: string | null
          remote_allowed?: boolean | null
          requirements?: string[] | null
          skills_required?: string[] | null
          stipend_max?: number | null
          stipend_min?: number | null
          title?: string
          updated_at?: string
          view_count?: number | null
          visibility_boost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "internships_posted_by_partner_id_fkey"
            columns: ["posted_by_partner_id"]
            isOneToOne: false
            referencedRelation: "affiliate_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_simulations: {
        Row: {
          answers: Json
          created_at: string
          duration_minutes: number | null
          feedback: Json
          id: string
          questions: Json
          role_type: string
          score: number | null
          simulation_type: string
          user_id: string
        }
        Insert: {
          answers?: Json
          created_at?: string
          duration_minutes?: number | null
          feedback?: Json
          id?: string
          questions?: Json
          role_type: string
          score?: number | null
          simulation_type?: string
          user_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          duration_minutes?: number | null
          feedback?: Json
          id?: string
          questions?: Json
          role_type?: string
          score?: number | null
          simulation_type?: string
          user_id?: string
        }
        Relationships: []
      }
      interviews: {
        Row: {
          application_id: string
          created_at: string
          id: string
          interview_date: string
          interview_type: string | null
          interviewer_email: string | null
          interviewer_name: string | null
          meeting_link: string | null
          notes: string | null
          reminder_sent: boolean | null
        }
        Insert: {
          application_id: string
          created_at?: string
          id?: string
          interview_date: string
          interview_type?: string | null
          interviewer_email?: string | null
          interviewer_name?: string | null
          meeting_link?: string | null
          notes?: string | null
          reminder_sent?: boolean | null
        }
        Update: {
          application_id?: string
          created_at?: string
          id?: string
          interview_date?: string
          interview_type?: string | null
          interviewer_email?: string | null
          interviewer_name?: string | null
          meeting_link?: string | null
          notes?: string | null
          reminder_sent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_entries: {
        Row: {
          category: string
          created_at: string
          id: string
          period: string
          rank: number | null
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          period?: string
          rank?: number | null
          score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          period?: string
          rank?: number | null
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mentor_sessions: {
        Row: {
          amount: number
          created_at: string
          duration_minutes: number
          id: string
          meeting_link: string | null
          mentor_id: string
          mentor_rating: number | null
          payment_id: string | null
          scheduled_at: string
          session_notes: string | null
          status: string
          student_id: string
          student_rating: number | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          duration_minutes?: number
          id?: string
          meeting_link?: string | null
          mentor_id: string
          mentor_rating?: number | null
          payment_id?: string | null
          scheduled_at: string
          session_notes?: string | null
          status?: string
          student_id: string
          student_rating?: number | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          duration_minutes?: number
          id?: string
          meeting_link?: string | null
          mentor_id?: string
          mentor_rating?: number | null
          payment_id?: string | null
          scheduled_at?: string
          session_notes?: string | null
          status?: string
          student_id?: string
          student_rating?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_sessions_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_sessions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      mentors: {
        Row: {
          availability_hours: Json | null
          avatar_url: string | null
          bio: string
          company: string
          created_at: string
          experience_years: number
          hourly_rate: number
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          linkedin_url: string | null
          name: string
          rating: number | null
          specialties: string[]
          title: string
          total_sessions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          availability_hours?: Json | null
          avatar_url?: string | null
          bio: string
          company: string
          created_at?: string
          experience_years: number
          hourly_rate: number
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          linkedin_url?: string | null
          name: string
          rating?: number | null
          specialties: string[]
          title: string
          total_sessions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          availability_hours?: Json | null
          avatar_url?: string | null
          bio?: string
          company?: string
          created_at?: string
          experience_years?: number
          hourly_rate?: number
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          linkedin_url?: string | null
          name?: string
          rating?: number | null
          specialties?: string[]
          title?: string
          total_sessions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      moderation_reports: {
        Row: {
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          reason: string
          reported_content_id: string
          reported_content_type: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          reason: string
          reported_content_id: string
          reported_content_type: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          reason?: string
          reported_content_id?: string
          reported_content_type?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: []
      }
      networking_channels: {
        Row: {
          channel_type: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_active: boolean
          is_premium_only: boolean
          metadata: Json | null
          name: string
          participant_limit: number | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          channel_type: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_premium_only?: boolean
          metadata?: Json | null
          name: string
          participant_limit?: number | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          channel_type?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_premium_only?: boolean
          metadata?: Json | null
          name?: string
          participant_limit?: number | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          customer_email: string | null
          customer_phone: string | null
          failed_at: string | null
          id: string
          notes: Json | null
          paid_at: string | null
          payment_method: string | null
          plan_name: string
          plan_type: string
          razorpay_order_id: string
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_phone?: string | null
          failed_at?: string | null
          id?: string
          notes?: Json | null
          paid_at?: string | null
          payment_method?: string | null
          plan_name: string
          plan_type: string
          razorpay_order_id: string
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_phone?: string | null
          failed_at?: string | null
          id?: string
          notes?: Json | null
          paid_at?: string | null
          payment_method?: string | null
          plan_name?: string
          plan_type?: string
          razorpay_order_id?: string
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      premium_guarantee_packs: {
        Row: {
          created_at: string
          description: string
          duration_months: number
          features: string[]
          guarantee_criteria: Json
          id: string
          is_active: boolean
          manual_verification: boolean
          max_applications: number | null
          name: string
          price: number
          support_level: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          duration_months?: number
          features: string[]
          guarantee_criteria: Json
          id?: string
          is_active?: boolean
          manual_verification?: boolean
          max_applications?: number | null
          name: string
          price: number
          support_level?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          duration_months?: number
          features?: string[]
          guarantee_criteria?: Json
          id?: string
          is_active?: boolean
          manual_verification?: boolean
          max_applications?: number | null
          name?: string
          price?: number
          support_level?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          email: string | null
          expected_stipend: number | null
          full_name: string | null
          github_url: string | null
          id: string
          is_premium: boolean | null
          linkedin_url: string | null
          location_preference: string | null
          notification_preferences: Json | null
          phone: string | null
          premium_expires_at: string | null
          referral_code: string | null
          referred_by: string | null
          resume_url: string | null
          role_preference: string | null
          skills: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email?: string | null
          expected_stipend?: number | null
          full_name?: string | null
          github_url?: string | null
          id?: string
          is_premium?: boolean | null
          linkedin_url?: string | null
          location_preference?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          premium_expires_at?: string | null
          referral_code?: string | null
          referred_by?: string | null
          resume_url?: string | null
          role_preference?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string | null
          expected_stipend?: number | null
          full_name?: string | null
          github_url?: string | null
          id?: string
          is_premium?: boolean | null
          linkedin_url?: string | null
          location_preference?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          premium_expires_at?: string | null
          referral_code?: string | null
          referred_by?: string | null
          resume_url?: string | null
          role_preference?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string
          endpoint: string
          id: string
          p256dh_key: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth_key: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh_key: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth_key?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh_key?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          referee_id: string
          referral_code: string
          referrer_id: string
          referrer_reward_claimed: boolean | null
          reward_claimed: boolean | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referee_id: string
          referral_code: string
          referrer_id: string
          referrer_reward_claimed?: boolean | null
          reward_claimed?: boolean | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referee_id?: string
          referral_code?: string
          referrer_id?: string
          referrer_reward_claimed?: boolean | null
          reward_claimed?: boolean | null
          status?: string
        }
        Relationships: []
      }
      resume_ai_analysis: {
        Row: {
          ats_score: number
          created_at: string
          format_score: number | null
          formatting_issues: string[] | null
          id: string
          keyword_match_score: number | null
          missing_keywords: string[] | null
          review_order_id: string
          sections_analysis: Json | null
          strengths: string[] | null
          structure_score: number | null
          suggestions: Json | null
          weaknesses: string[] | null
        }
        Insert: {
          ats_score: number
          created_at?: string
          format_score?: number | null
          formatting_issues?: string[] | null
          id?: string
          keyword_match_score?: number | null
          missing_keywords?: string[] | null
          review_order_id: string
          sections_analysis?: Json | null
          strengths?: string[] | null
          structure_score?: number | null
          suggestions?: Json | null
          weaknesses?: string[] | null
        }
        Update: {
          ats_score?: number
          created_at?: string
          format_score?: number | null
          formatting_issues?: string[] | null
          id?: string
          keyword_match_score?: number | null
          missing_keywords?: string[] | null
          review_order_id?: string
          sections_analysis?: Json | null
          strengths?: string[] | null
          structure_score?: number | null
          suggestions?: Json | null
          weaknesses?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "resume_ai_analysis_review_order_id_fkey"
            columns: ["review_order_id"]
            isOneToOne: false
            referencedRelation: "resume_review_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_customizations: {
        Row: {
          cover_letter: string | null
          created_at: string
          customized_content: Json
          id: string
          internship_id: string
          linkedin_summary: string | null
          template_id: string
          user_id: string
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string
          customized_content?: Json
          id?: string
          internship_id: string
          linkedin_summary?: string | null
          template_id?: string
          user_id: string
        }
        Update: {
          cover_letter?: string | null
          created_at?: string
          customized_content?: Json
          id?: string
          internship_id?: string
          linkedin_summary?: string | null
          template_id?: string
          user_id?: string
        }
        Relationships: []
      }
      resume_review_orders: {
        Row: {
          ai_analysis: Json | null
          ai_completed_at: string | null
          assigned_at: string | null
          ats_score: number | null
          created_at: string
          estimated_completion_at: string | null
          human_review_completed_at: string | null
          id: string
          improvement_suggestions: Json | null
          payment_id: string | null
          priority: string
          resume_text: string | null
          resume_url: string
          reviewer_feedback: string | null
          reviewer_id: string | null
          reviewer_score: number | null
          service_type: string
          status: string
          target_industry: string | null
          target_role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          ai_completed_at?: string | null
          assigned_at?: string | null
          ats_score?: number | null
          created_at?: string
          estimated_completion_at?: string | null
          human_review_completed_at?: string | null
          id?: string
          improvement_suggestions?: Json | null
          payment_id?: string | null
          priority?: string
          resume_text?: string | null
          resume_url: string
          reviewer_feedback?: string | null
          reviewer_id?: string | null
          reviewer_score?: number | null
          service_type?: string
          status?: string
          target_industry?: string | null
          target_role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_analysis?: Json | null
          ai_completed_at?: string | null
          assigned_at?: string | null
          ats_score?: number | null
          created_at?: string
          estimated_completion_at?: string | null
          human_review_completed_at?: string | null
          id?: string
          improvement_suggestions?: Json | null
          payment_id?: string | null
          priority?: string
          resume_text?: string | null
          resume_url?: string
          reviewer_feedback?: string | null
          reviewer_id?: string | null
          reviewer_score?: number | null
          service_type?: string
          status?: string
          target_industry?: string | null
          target_role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_review_orders_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resume_review_orders_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "resume_reviewers"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_reviewers: {
        Row: {
          bio: string | null
          created_at: string
          email: string
          expertise_areas: string[] | null
          full_name: string
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          linkedin_url: string | null
          rating: number | null
          total_reviews: number | null
          updated_at: string
          user_id: string | null
          years_experience: number
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email: string
          expertise_areas?: string[] | null
          full_name: string
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          linkedin_url?: string | null
          rating?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string | null
          years_experience?: number
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string
          expertise_areas?: string[] | null
          full_name?: string
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          linkedin_url?: string | null
          rating?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string | null
          years_experience?: number
        }
        Relationships: []
      }
      reviewer_assignments: {
        Row: {
          actual_hours: number | null
          assigned_at: string
          created_at: string
          due_date: string
          estimated_hours: number | null
          id: string
          review_order_id: string
          reviewer_id: string
          status: string
          updated_at: string
        }
        Insert: {
          actual_hours?: number | null
          assigned_at?: string
          created_at?: string
          due_date: string
          estimated_hours?: number | null
          id?: string
          review_order_id: string
          reviewer_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          actual_hours?: number | null
          assigned_at?: string
          created_at?: string
          due_date?: string
          estimated_hours?: number | null
          id?: string
          review_order_id?: string
          reviewer_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviewer_assignments_review_order_id_fkey"
            columns: ["review_order_id"]
            isOneToOne: false
            referencedRelation: "resume_review_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviewer_assignments_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "resume_reviewers"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_certifications: {
        Row: {
          category: string
          certificate_template_url: string | null
          coding_challenges: Json | null
          created_at: string
          description: string
          difficulty_level: string
          duration_minutes: number
          id: string
          is_active: boolean
          pass_percentage: number
          prerequisites: string[] | null
          price: number
          questions: Json
          skills_covered: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          certificate_template_url?: string | null
          coding_challenges?: Json | null
          created_at?: string
          description: string
          difficulty_level?: string
          duration_minutes?: number
          id?: string
          is_active?: boolean
          pass_percentage?: number
          prerequisites?: string[] | null
          price: number
          questions?: Json
          skills_covered?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          certificate_template_url?: string | null
          coding_challenges?: Json | null
          created_at?: string
          description?: string
          difficulty_level?: string
          duration_minutes?: number
          id?: string
          is_active?: boolean
          pass_percentage?: number
          prerequisites?: string[] | null
          price?: number
          questions?: Json
          skills_covered?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      skill_gap_analysis: {
        Row: {
          analysis_date: string
          created_at: string
          current_skills: string[]
          gap_skills: string[]
          id: string
          market_skills: string[]
          recommendations: string[]
          user_id: string
        }
        Insert: {
          analysis_date?: string
          created_at?: string
          current_skills?: string[]
          gap_skills?: string[]
          id?: string
          market_skills?: string[]
          recommendations?: string[]
          user_id: string
        }
        Update: {
          analysis_date?: string
          created_at?: string
          current_skills?: string[]
          gap_skills?: string[]
          id?: string
          market_skills?: string[]
          recommendations?: string[]
          user_id?: string
        }
        Relationships: []
      }
      story_interactions: {
        Row: {
          content: string | null
          created_at: string
          id: string
          interaction_type: string
          story_id: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          interaction_type: string
          story_id: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          interaction_type?: string
          story_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_interactions_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "alumni_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      upsell_service_orders: {
        Row: {
          admin_assigned_to: string | null
          client_feedback: string | null
          client_rating: number | null
          completion_date: string | null
          created_at: string
          id: string
          input_data: Json | null
          output_data: Json | null
          payment_id: string | null
          service_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_assigned_to?: string | null
          client_feedback?: string | null
          client_rating?: number | null
          completion_date?: string | null
          created_at?: string
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          payment_id?: string | null
          service_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_assigned_to?: string | null
          client_feedback?: string | null
          client_rating?: number | null
          completion_date?: string | null
          created_at?: string
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          payment_id?: string | null
          service_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "upsell_service_orders_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "upsell_service_orders_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "upsell_services"
            referencedColumns: ["id"]
          },
        ]
      }
      upsell_services: {
        Row: {
          category: string
          created_at: string
          delivery_days: number
          description: string
          features: string[]
          id: string
          is_active: boolean
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          delivery_days?: number
          description: string
          features: string[]
          id?: string
          is_active?: boolean
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          delivery_days?: number
          description?: string
          features?: string[]
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_description: string
          achievement_icon: string
          achievement_name: string
          achievement_type: string
          created_at: string
          id: string
          is_unlocked: boolean
          metadata: Json | null
          progress: number
          target: number
          unlocked_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          achievement_description: string
          achievement_icon: string
          achievement_name: string
          achievement_type: string
          created_at?: string
          id?: string
          is_unlocked?: boolean
          metadata?: Json | null
          progress?: number
          target?: number
          unlocked_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          achievement_description?: string
          achievement_icon?: string
          achievement_name?: string
          achievement_type?: string
          created_at?: string
          id?: string
          is_unlocked?: boolean
          metadata?: Json | null
          progress?: number
          target?: number
          unlocked_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_certification_attempts: {
        Row: {
          ai_analysis: Json | null
          answers: Json
          certificate_issued_at: string | null
          certificate_url: string | null
          certification_id: string
          coding_submissions: Json | null
          created_at: string
          id: string
          payment_id: string | null
          plagiarism_score: number | null
          score: number | null
          started_at: string
          status: string
          submitted_at: string | null
          time_spent_minutes: number | null
          user_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          answers?: Json
          certificate_issued_at?: string | null
          certificate_url?: string | null
          certification_id: string
          coding_submissions?: Json | null
          created_at?: string
          id?: string
          payment_id?: string | null
          plagiarism_score?: number | null
          score?: number | null
          started_at?: string
          status?: string
          submitted_at?: string | null
          time_spent_minutes?: number | null
          user_id: string
        }
        Update: {
          ai_analysis?: Json | null
          answers?: Json
          certificate_issued_at?: string | null
          certificate_url?: string | null
          certification_id?: string
          coding_submissions?: Json | null
          created_at?: string
          id?: string
          payment_id?: string | null
          plagiarism_score?: number | null
          score?: number | null
          started_at?: string
          status?: string
          submitted_at?: string | null
          time_spent_minutes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_certification_attempts_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "skill_certifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_certification_attempts_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reading_history: {
        Row: {
          completed: boolean | null
          created_at: string
          id: string
          post_id: string
          reading_time_seconds: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          id?: string
          post_id: string
          reading_time_seconds?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          id?: string
          post_id?: string
          reading_time_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_reading_history_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_rewards: {
        Row: {
          claimed_at: string
          created_at: string
          description: string
          expires_at: string | null
          id: string
          metadata: Json | null
          reward_type: string
          reward_value: number
          user_id: string
        }
        Insert: {
          claimed_at?: string
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          reward_type: string
          reward_value?: number
          user_id: string
        }
        Update: {
          claimed_at?: string
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          reward_type?: string
          reward_value?: number
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          ai_tokens_earned: number
          ai_tokens_used: number
          created_at: string
          current_streak: number
          experience_points: number
          id: string
          last_login: string | null
          level: number
          longest_streak: number
          premium_trial_days: number
          total_applications: number
          total_interviews: number
          total_selections: number
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_tokens_earned?: number
          ai_tokens_used?: number
          created_at?: string
          current_streak?: number
          experience_points?: number
          id?: string
          last_login?: string | null
          level?: number
          longest_streak?: number
          premium_trial_days?: number
          total_applications?: number
          total_interviews?: number
          total_selections?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_tokens_earned?: number
          ai_tokens_used?: number
          created_at?: string
          current_streak?: number
          experience_points?: number
          id?: string
          last_login?: string | null
          level?: number
          longest_streak?: number
          premium_trial_days?: number
          total_applications?: number
          total_interviews?: number
          total_selections?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      video_call_sessions: {
        Row: {
          channel_id: string
          created_at: string
          duration_minutes: number
          host_id: string
          id: string
          max_participants: number | null
          meeting_url: string | null
          metadata: Json | null
          recording_url: string | null
          scheduled_at: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          channel_id: string
          created_at?: string
          duration_minutes?: number
          host_id: string
          id?: string
          max_participants?: number | null
          meeting_url?: string | null
          metadata?: Json | null
          recording_url?: string | null
          scheduled_at: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          channel_id?: string
          created_at?: string
          duration_minutes?: number
          host_id?: string
          id?: string
          max_participants?: number | null
          meeting_url?: string | null
          metadata?: Json | null
          recording_url?: string | null
          scheduled_at?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_call_sessions_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "networking_channels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auto_apply_to_internships: {
        Args: { max_applications?: number; user_id_param: string }
        Returns: Json
      }
      auto_assign_reviewer: {
        Args: { order_id: string }
        Returns: string
      }
      award_daily_login_reward: {
        Args: { user_id_param: string }
        Returns: Json
      }
      current_user_is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_referral_stats: {
        Args: { user_id_param: string }
        Returns: Json
      }
      increment_blog_view_count: {
        Args: { post_id: string }
        Returns: undefined
      }
      increment_combo_pack_enrollment: {
        Args: { pack_id: string }
        Returns: undefined
      }
      initialize_user_achievements: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
