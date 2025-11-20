/**
 * Cloudinary Upload Widget Helper
 * Initializes and opens the Cloudinary upload widget for profile pictures
 */

export const openCloudinaryWidget = (cloudName, uploadPreset, onSuccess, onError) => {
    // Create widget
    const widget = window.cloudinary.createUploadWidget(
        {
            cloudName: cloudName,
            uploadPreset: uploadPreset,
            sources: ['local', 'camera'],
            multiple: false,
            maxFiles: 1,
            maxFileSize: 5000000, // 5MB
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            cropping: true,
            croppingAspectRatio: 1, // Square crop
            croppingShowDimensions: true,
            folder: 'msa-profile-pictures',
            resourceType: 'image',
            theme: 'minimal',
            styles: {
                palette: {
                    window: '#FFFFFF',
                    windowBorder: '#10B981',
                    tabIcon: '#10B981',
                    menuIcons: '#5A616A',
                    textDark: '#000000',
                    textLight: '#FFFFFF',
                    link: '#10B981',
                    action: '#10B981',
                    inactiveTabIcon: '#969696',
                    error: '#EF4444',
                    inProgress: '#10B981',
                    complete: '#22C55E',
                    sourceBg: '#F3F4F6'
                },
                fonts: {
                    default: null,
                    "'Roboto', sans-serif": {
                        url: 'https://fonts.googleapis.com/css?family=Roboto',
                        active: true
                    }
                }
            }
        },
        (error, result) => {
            if (error) {
                console.error('Upload widget error:', error);
                if (onError) onError(error);
                return;
            }

            if (result.event === 'success') {
                console.log('Upload successful:', result.info);
                if (onSuccess) onSuccess(result.info.secure_url);
            }

            // Close widget after upload
            if (result.event === 'success' || result.event === 'abort') {
                widget.close();
            }
        }
    );

    // Open the widget
    widget.open();

    return widget;
};
