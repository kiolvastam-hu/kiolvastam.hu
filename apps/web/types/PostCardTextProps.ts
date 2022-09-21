import React from "react"

export type PostCardTextProps = {
	isEditing: boolean
	setIsEditing: React.Dispatch<React.SetStateAction<boolean>>


	editingField: string
	setEditingField: React.Dispatch<React.SetStateAction<string>>

	isEditSaving: boolean
	setIsEditSaving: React.Dispatch<React.SetStateAction<boolean>>
}